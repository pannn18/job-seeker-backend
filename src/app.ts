import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import hrdRoutes from "./router/hrdRoutes";
import societyRoutes from "./router/applyRoutes";

dotenv.config();

export const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Routes
app.use("/hrd", hrdRoutes);
app.use("/society", societyRoutes);

export default app;
