import { Request, Response } from "express";
import { PrismaClient, Role, ApplicationStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const applyPosition = async (req: Request, res: Response) => {
  try {
    const { id: userId, role } = (req as any).user;
    if (role !== Role.Society) {
      return res.status(403).json({ message: "Hanya Society yang boleh melamar posisi" });
    }

    const { availablePositionId } = req.body;

    const society = await prisma.society.findFirst({ where: { userId } });
    if (!society) {
      return res.status(400).json({ message: "Society belum terdaftar" });
    }

    const position = await prisma.availablePosition.findUnique({
      where: { id: Number(availablePositionId) },
    });
    if (!position) {
      return res.status(404).json({ message: "Posisi tidak ditemukan" });
    }

    const now = new Date();
    if (now > position.submissionEndDate) {
      return res.status(400).json({ message: "Pendaftaran posisi sudah ditutup" });
    }

    const existing = await prisma.positionApplied.findFirst({
      where: { societyId: society.id, availablePositionId: position.id },
    });
    if (existing) {
      return res.status(400).json({ message: "Anda sudah melamar posisi ini" });
    }

    const applied = await prisma.positionApplied.create({
      data: {
        availablePositionId: position.id,
        societyId: society.id,
        applyDate: now,
        status: ApplicationStatus.PENDING,
      },
    });

    res.status(201).json({ message: "Lamaran berhasil diajukan", data: applied });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getMyApplicationHistory = async (req: Request, res: Response) => {
  try {
    const { id: userId, role } = (req as any).user;
    if (role !== Role.Society) {
      return res.status(403).json({ message: "Hanya Society yang boleh melihat riwayat lamaran" });
    }

    // cari society berdasarkan userId
    const society = await prisma.society.findFirst({ where: { userId } });
    if (!society) {
      return res.status(400).json({ message: "Society belum terdaftar" });
    }

    // ambil daftar lamaran dengan detail posisi + perusahaan
    const history = await prisma.positionApplied.findMany({
      where: { societyId: society.id },
      include: {
        availablePosition: {
          include: {
            company: true
          }
        }
      },
      orderBy: { applyDate: "desc" } // urut dari terbaru
    });

    const formatted = history.map(app => ({
      id: app.id,
      positionName: app.availablePosition.positionName,
      companyName: app.availablePosition.company.name,
      applyDate: app.applyDate,
      status: app.status
    }));

    res.status(200).json({ message: "Riwayat lamaran ditemukan", data: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const app = await prisma.positionApplied.findUnique({
      where: { id: Number(id) },
      include: { availablePosition: true, society: true },
    });

    if (!app) {
      return res.status(404).json({ message: "Lamaran tidak ditemukan" });
    }

    res.status(200).json({ message: "Detail lamaran ditemukan", data: app });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getCompanyApplications = async (req: Request, res: Response) => {
  try {
    const { id: userId, role } = (req as any).user;
    if (role !== Role.HRD) {
      return res.status(403).json({ message: "Hanya HRD yang boleh melihat lamaran" });
    }

    // cari company berdasarkan HRD (userId)
    const company = await prisma.company.findFirst({ where: { userId } });
    if (!company) {
      return res.status(404).json({ message: "Perusahaan tidak ditemukan untuk HRD ini" });
    }

    // ambil semua lamaran yang masuk ke company ini
    const applications = await prisma.positionApplied.findMany({
      where: {
        availablePosition: {
          companyId: company.id
        }
      },
      include: {
        availablePosition: true,
        society: true
      },
      orderBy: { applyDate: "desc" }
    });

    const formatted = applications.map(app => ({
      id: app.id,
      positionName: app.availablePosition.positionName,
      applicantName: app.society.name,
      applyDate: app.applyDate,
      status: app.status
    }));

    res.status(200).json({
      message: "Daftar lamaran ke perusahaan berhasil diambil",
      data: formatted
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id: userId, role } = (req as any).user;
    if (role !== Role.HRD) {
      return res.status(403).json({ message: "Hanya HRD yang boleh update status lamaran" });
    }

    const { id } = req.params;
    const { status } = req.body; // ACCEPTED / REJECTED

    const application = await prisma.positionApplied.findUnique({
      where: { id: Number(id) },
      include: { availablePosition: true },
    });
    if (!application) {
      return res.status(404).json({ message: "Lamaran tidak ditemukan" });
    }

    // cek apakah posisi milik HRD yang login
    const company = await prisma.company.findFirst({ where: { userId } });
    if (!company || company.id !== application.availablePosition.companyId) {
      return res.status(403).json({ message: "Anda tidak berhak mengubah status lamaran ini" });
    }

    const updated = await prisma.positionApplied.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.status(200).json({ message: "Status lamaran diperbarui", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { id: userId, role } = (req as any).user;
    if (role !== Role.Society) {
      return res.status(403).json({ message: "Hanya Society yang boleh membatalkan lamaran" });
    }

    const { id } = req.params;
    const society = await prisma.society.findFirst({ where: { userId } });

    const app = await prisma.positionApplied.findUnique({ where: { id: Number(id) } });

    if (!app || app.societyId !== society?.id) {
      return res.status(403).json({ message: "Anda tidak berhak membatalkan lamaran ini" });
    }

    await prisma.positionApplied.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Lamaran berhasil dibatalkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
