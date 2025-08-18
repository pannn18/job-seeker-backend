import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export const createAvailablePosition = async (req: Request, res: Response) => {
  try {
    const { id, role } = (req as any).user; // asumsi dari JWT middleware
    if (role !== Role.HRD) {
      return res.status(403).json({ message: "Hanya HRD yang boleh membuat posisi" });
    }

    const { positionName, capacity, description, submissionStartDate, submissionEndDate } = req.body;

    // validasi simple
    if (!positionName || !capacity || !submissionStartDate || !submissionEndDate) {
      return res.status(400).json({ message: "Field wajib tidak boleh kosong" });
    }

    // cek apakah HRD punya company
    const company = await prisma.company.findFirst({ where: { userId: id } });
    if (!company) {
      return res.status(400).json({ message: "HRD belum memiliki company" });
    }

    const newPosition = await prisma.availablePosition.create({
      data: {
        positionName,
        capacity: Number(capacity),
        description,
        submissionStartDate: new Date(submissionStartDate),
        submissionEndDate: new Date(submissionEndDate),
        companyId: company.id,
      },
    });

    res.status(201).json({ message: "Available position berhasil dibuat", data: newPosition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getAvailablePositions = async (_req: Request, res: Response) => {
  try {
    const positions = await prisma.availablePosition.findMany({
      include: { company: true },
    });
    res.status(200).json({ message: "Daftar posisi tersedia", data: positions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getAvailablePositionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const position = await prisma.availablePosition.findUnique({
      where: { id: Number(id) },
      include: { company: true },
    });

    if (!position) {
      return res.status(404).json({ message: "Posisi tidak ditemukan" });
    }

    res.status(200).json({ message: "Detail posisi ditemukan", data: position });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const updateAvailablePosition = async (req: Request, res: Response) => {
  try {
    const { id: userId, role } = (req as any).user;
    if (role !== Role.HRD) {
      return res.status(403).json({ message: "Hanya HRD yang boleh update posisi" });
    }

    const { id } = req.params;
    const { positionName, capacity, description, submissionStartDate, submissionEndDate } = req.body;

    // cek apakah posisi ini milik HRD yang sedang login
    const company = await prisma.company.findFirst({ where: { userId } });
    const position = await prisma.availablePosition.findUnique({ where: { id: Number(id) } });

    if (!position || position.companyId !== company?.id) {
      return res.status(403).json({ message: "Anda tidak berhak mengubah posisi ini" });
    }

    const updated = await prisma.availablePosition.update({
      where: { id: Number(id) },
      data: {
        positionName: positionName ?? position.positionName,
        capacity: capacity ?? position.capacity,
        description: description ?? position.description,
        submissionStartDate: submissionStartDate ? new Date(submissionStartDate) : position.submissionStartDate,
        submissionEndDate: submissionEndDate ? new Date(submissionEndDate) : position.submissionEndDate,
      },
    });

    res.status(200).json({ message: "Available position berhasil diperbarui", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const deleteAvailablePosition = async (req: Request, res: Response) => {
  try {
    const { id: userId, role } = (req as any).user;
    if (role !== Role.HRD) {
      return res.status(403).json({ message: "Hanya HRD yang boleh hapus posisi" });
    }

    const { id } = req.params;

    // cek apakah posisi ini milik HRD
    const company = await prisma.company.findFirst({ where: { userId } });
    const position = await prisma.availablePosition.findUnique({ where: { id: Number(id) } });

    if (!position || position.companyId !== company?.id) {
      return res.status(403).json({ message: "Anda tidak berhak menghapus posisi ini" });
    }

    await prisma.availablePosition.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Available position berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
