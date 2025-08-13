import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Validasi role harus HRD atau Society
    if (!["HRD", "Society"].includes(role)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }

    // Cek email sudah ada atau belum
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;

    if (role === "HRD") {
      const { companyName, companyAddress, companyPhone, companyDescription } = req.body;

      newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          company: {
            create: {
              name: companyName,
              address: companyAddress,
              phone: companyPhone,
              description: companyDescription,
            },
          },
        },
        include: {
          company: true,
        },
      });
    } else if (role === "Society") {
      // Data tambahan masyarakat
      const { address, phone, dateOfBirth, gender } = req.body;

      newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
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
        include: {
          society: true,
        },
      });
    }

    res.status(201).json({
      message: `${role} berhasil registrasi`,
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!["HRD", "Society"].includes(role)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: role === "HRD" ? true : false,
        society: role === "Society" ? true : false,
      },
    });

    if (!user || user.role !== role) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login berhasil",
      token
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