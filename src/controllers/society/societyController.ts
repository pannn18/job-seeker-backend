import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// CREATE Society
export const createSociety = async (req: Request, res: Response) => {
  try {
    const { userId, name, address, phone, dateOfBirth, gender } = req.body;

    // Pastikan user ada
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) {
      return res.status(400).json({ message: "User tidak valid" });
    }

    // Kalau role belum ada, set ke "Society"
    if (!user.role) {
      await prisma.user.update({
        where: { id: Number(userId) },
        data: { role: "Society" },
      });
    } else if (user.role !== "Society") {
      return res.status(400).json({ message: "User bukan Society" });
    }

    // Cek apakah society untuk user ini sudah ada
    const existingSociety = await prisma.society.findFirst({
      where: { userId: Number(userId) },
    });
    if (existingSociety) {
      return res.status(400).json({ message: "Society untuk user ini sudah ada" });
    }

    const society = await prisma.society.create({
      data: {
        name,
        address,
        phone,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        userId: Number(userId),
      },
    });

    res.status(201).json({
      message: "Society berhasil dibuat",
      data: society,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// READ Society by ID
export const getSocietyById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const society = await prisma.society.findUnique({
      where: { id },
      include: {
        user: true,
        portfolios: true,
        applications: {
          include: {
            availablePosition: true,
          },
        },
      },
    });

    if (!society) {
      return res.status(404).json({ message: "Society tidak ditemukan" });
    }

    res.status(200).json({
      message: "Society berhasil ditemukan",
      data: society,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// UPDATE Society
export const updateSociety = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, address, phone, dateOfBirth, gender } = req.body;

    const society = await prisma.society.findUnique({ where: { id } });
    if (!society) {
      return res.status(404).json({ message: "Society tidak ditemukan" });
    }

    const updatedSociety = await prisma.society.update({
      where: { id },
      data: {
        name: name ?? society.name,
        address: address ?? society.address,
        phone: phone ?? society.phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : society.dateOfBirth,
        gender: gender ?? society.gender,
      },
    });

    res.status(200).json({
      message: "Society berhasil diperbarui",
      data: updatedSociety,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};