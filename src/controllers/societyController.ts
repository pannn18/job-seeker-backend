import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

// Society melamar ke posisi
export const applyToPosition = async (req: Request, res: Response) => {
  try {
    const { societyId, availablePositionId } = req.body;

    // Cek apakah posisi tersedia
    const position = await prisma.availablePosition.findUnique({
      where: { id: availablePositionId },
    });
    if (!position) {
      return res.status(404).json({ message: 'Posisi tidak ditemukan' });
    }

    // Cek apakah Society sudah melamar sebelumnya
    const existingApplication = await prisma.positionApplied.findFirst({
      where: {
        societyId,
        availablePositionId
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Anda sudah melamar posisi ini' });
    }

    // Simpan lamaran
    const application = await prisma.positionApplied.create({
      data: {
        societyId,
        availablePositionId,
        applyDate: new Date(),
        status: 'PENDING'
      }
    });

    res.status(201).json({
      message: 'Lamaran berhasil diajukan',
      application
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
