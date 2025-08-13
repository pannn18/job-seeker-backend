import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const addPosition = async (req: Request, res: Response) => {
  try {
    const { positionName, capacity, description, submissionStartDate, submissionEndDate } = req.body;

    // Ambil companyId dari user login (HRD)
    const userId = req.user?.id;
    const company = await prisma.company.findFirst({
      where: { userId }
    });

    if (!company) {
      return res.status(404).json({ message: "Company tidak ditemukan" });
    }

    const newPosition = await prisma.availablePosition.create({
      data: {
        positionName,
        capacity,
        description,
        submissionStartDate: new Date(submissionStartDate),
        submissionEndDate: new Date(submissionEndDate),
        companyId: company.id
      }
    });

    res.status(201).json({
      message: "Posisi berhasil ditambahkan",
      data: newPosition
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
