import { Router } from "express";
import { upload } from "../../middleware/upload.middleware";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../../middleware/authMiddleware";
import { createPortofolioValidation, updatePortofolioValidation } from "../../validation/portofolio.validation";
import {
  createPortofolio,
  getAllPortofolio,
  getPortofolioById,
  updatePortofolio,
  deletePortofolio
} from "../../controllers/portofolio/portofolio.controller";

const router = Router();

router.post("/Add-Portofolio", upload.single("file"), authenticate, authorize("Society") ,validate(createPortofolioValidation), createPortofolio);
router.get("/Portofolio", authenticate, authorize("HRD"), getAllPortofolio);
router.get("/Portofolio/:id", authenticate, authorize("Society", "HRD"), getPortofolioById);
router.put("/Update-Portofolio/:id", upload.single("file"), validate(updatePortofolioValidation), updatePortofolio);
router.delete("/Delete-Portofolio/:id", deletePortofolio);

export default router;
