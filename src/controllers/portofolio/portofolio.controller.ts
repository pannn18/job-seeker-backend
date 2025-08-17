import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createPortofolio = async (req: Request, res: Response) => {
  try {
    const { skill, description, societyId } = req.body;

        const PortofolioExists = await prisma.portofolio.findFirst({
      where: {
        societyId: Number(societyId),
      },
    })

    if (PortofolioExists) {
      return res.status(400).json({ message: "Portofolio sudah ada" });
    }

    const society = await prisma.society.findUnique({
      where: { id: Number(societyId) }
    });

    if (!society) {
      return res.status(400).json({ message: `Society ID ${societyId} tidak ditemukan` });
    }

    const fileName = req.file ? req.file.filename : null;
    if (!fileName) {
      return res.status(400).json({ message: "File is required" });
    }
    const portofolio = await prisma.portofolio.create({
      data: {
        skill,
        description,
        file: fileName,
        societyId: Number(societyId),
      },
    });

    res.status(201).json({
      message: "Portofolio berhasil dibuat",
      data: portofolio,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

export const getAllPortofolio = async (req: Request, res: Response) => {
  try {
    const data = await prisma.portofolio.findMany();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getPortofolioById = async (req: Request, res: Response) => {
  try {

    const id = req.params.id;

    const PortofolioNotFound = await prisma.portofolio.findFirst({
      where: {
        id: Number(id)
      }
    })

    if (!PortofolioNotFound) {
      return res.status(404).json({ message: "Portofolio tidak ditemukan" });
    }

    const getPortofolioId = await prisma.portofolio.findFirst({
      where: {
        id: Number(id)
      },
    });

    if (!getPortofolioId) {
      return res.status(404).json({ message: "Portofolio tidak ditemukan" });
    }

    res.status(200).json({
      message: "Portofolio berhasil ditemukan",
      data: getPortofolioId,
    });


  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const updatePortofolio = async (req: Request, res: Response) => {
  try {
    const existing = await prisma.portofolio.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!existing) return res.status(404).json({ message: "Not found" });

    const updated = await prisma.portofolio.update({
      where: { id: Number(req.params.id) },
      data: {
        skill: req.body.skill ?? existing.skill,
        description: req.body.description ?? existing.description,
        file: req.file ? req.file.filename : existing.file,
        societyId: req.body.societyId ? Number(req.body.societyId) : existing.societyId,
      },
    });

    res.json({ message: "Portofolio updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const deletePortofolio = async (req: Request, res: Response) => {
  try {
    const existing = await prisma.portofolio.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!existing) return res.status(404).json({ message: "Not found" });

    await prisma.portofolio.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Portofolio deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};