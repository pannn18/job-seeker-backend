import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const allowed = ["HRD", "Society"] as const;
    if (role !== undefined && !allowed.includes(role)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === undefined) {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        },
      });

      return res.status(201).json({
        message:
          "User berhasil registrasi tanpa role. Lengkapi profil lewat endpoint /society atau /HRD.",
        data: user,
      });
    }

    if (role === "HRD") {
      const { companyName, companyAddress, companyPhone, companyDescription } =
        req.body;

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "HRD" as Role,
          company: {
            create: {
              name: companyName,
              address: companyAddress,
              phone: companyPhone,
              description: companyDescription,
            },
          },
        },
        include: { company: true },
      });

      return res.status(201).json({
        message: "HRD berhasil registrasi",
        data: newUser,
      });
    }

    if (role === "Society") {
      const { address, phone, dateOfBirth, gender } = req.body;

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "Society" as Role,
          society: {
            create: {
              name,
              address,
              phone,
              dateOfBirth: new Date(dateOfBirth),
              gender,
            },
          },
        },
        include: { society: true },
      });

      return res.status(201).json({
        message: "Society berhasil registrasi",
        data: newUser,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: role === "HRD" ? true : false,
        society: role === "Society" ? true : false,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    if (!user.role) {
      const token = jwt.sign(
        { id: user.id, role: null },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Login berhasil (role masih kosong)",
        token,
        data: user,
      });
    }

    if (role && user.role !== role) {
      return res.status(400).json({ message: "Role tidak sesuai dengan user" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login berhasil",
      token,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

  export const updateProfile = async (req: Request, res: Response) => {
    try {

      const id = req.params.id

      const existing = await prisma.user.findFirst({
        where: {
          id: Number(id)
        }
      })

      if (!existing) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      const { name, email, password } = req.body;

      const updatedUser = await prisma.user.update({
        where: {id: Number(id)},
        data: {
          name: name ?? existing?.name,
          email: email ?? existing?.email,
          password: password ? await bcrypt.hash(password, 12) : existing?.password,
        },
      })

      if(!updatedUser) {
        return res.status(400).json({ message: "Gagal memperbarui profil" });
      }

      res.status(200).json({
        message: "Profil berhasil diperbarui",
        data: updatedUser
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  }

  export const getProfile = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const UserNotFound = await prisma.user.findFirst({
        where: {
          id: Number(id)
        }
      })

      if (!UserNotFound) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }
      
      const getProfile = await prisma.user.findFirst({
        where: {
          id: Number(id)
        },
        include: {
          company: true,
          society: true,
        }
      })

      if (!getProfile) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      res.status(200).json({
        message: "Profil berhasil ditemukan",
        data: getProfile
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  }

  export const deleteProfile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const existing = await prisma.user.findFirst({
          where: {
            id: Number(id)
          }
        })

        if (!existing) {
          return res.status(404).json({ message: "User tidak ditemukan" });
        }

        await prisma.user.delete({
          where: {
            id: Number(id)
          }
        })

        res.status(200).json({ message: "Profil berhasil dihapus" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  }

  