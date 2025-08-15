import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import HrdRoutes from "./router/hrd/hrd.route";
import societyRoutes from "./router/society/society.route";
import PortofolioRoutes from "./router/portofolio/portofolio.router";

dotenv.config();

export const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Routes
app.use("/hrd", HrdRoutes);

app.use("/society", societyRoutes);

app.use("/portofolio", PortofolioRoutes);

export default app;
