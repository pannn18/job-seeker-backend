import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import HrdRoutes from "./router/hrd/hrd.route";
import userRoutes from "./router/user (public)/user.route";
import societyRoutes from "./router/society/society.route"
import PortofolioRoutes from "./router/portofolio/portofolio.router";
import positionRoutes from "./router/position/position.router"

dotenv.config();

export const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Routes
app.use("/hrd", HrdRoutes);

app.use("/user", userRoutes);

app.use("/society", societyRoutes);

app.use("/position", positionRoutes);

app.use

app.use("/portofolio", PortofolioRoutes);

export default app;
