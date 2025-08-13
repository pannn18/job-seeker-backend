import { PrismaClient, ApplicationStatus } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Tambah posisi baru (HRD)
export const addPosition = async (req: Request, res: Response) => {
  try {
    const { positionName, capacity, description, submissionStartDate, submissionEndDate } = req.body;

    // Ambil companyId dari user login (HRD)
    const userId = req.user?.id; // Pastikan middleware auth sudah isi req.user
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

// Lihat pelamar di posisi tertentu
export const getApplicationsByPosition = async (req: Request, res: Response) => {
  try {
    const { positionId } = req.params;

    const applications = await prisma.positionApplied.findMany({
      where: { availablePositionId: Number(positionId) },
      include: {
        society: {
          include: { portfolios: true }
        }
      }
    });

    res.json({ data: applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Ubah status lamaran
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(ApplicationStatus).includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const updated = await prisma.positionApplied.update({
      where: { id: Number(id) },
      data: { status }
    });

    res.json({
      message: "Status lamaran berhasil diubah",
      data: updated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Hapus posisi
export const deletePosition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.availablePosition.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Posisi berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const updatePosition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { positionName, capacity, description, submissionStartDate, submissionEndDate } = req.body;

    const updatedPosition = await prisma.availablePosition.update({
      where: { id: Number(id) },
      data: {
        positionName,
        capacity,
        description,
        submissionStartDate: new Date(submissionStartDate),
        submissionEndDate: new Date(submissionEndDate)
      }
    });

    res.json({
      message: "Posisi berhasil diperbarui",
      data: updatedPosition
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
