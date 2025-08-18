import { Router } from "express";
import { validate } from "../../middleware/validate";
import { applyPosition, deleteApplication, getApplicationById, getCompanyApplications, getMyApplicationHistory, updateApplicationStatus } from "../../controllers/PositionApplied/PositionAppliedController";
import { applyPositionSchema, updateApplicationStatusSchema } from "../../validation/positionApp.validation";
import { authenticate, authorize } from "../../middleware/authMiddleware";
import { Role } from "@prisma/client";


const router = Router();


router.post("/apply",authenticate, authorize(Role.Society), validate(applyPositionSchema), applyPosition);
router.get("/my-history",authenticate, authorize(Role.Society), getMyApplicationHistory);
router.get("/my-history/:id",authenticate, authorize(Role.Society), getApplicationById);
router.put("/society-history/:id/status",authenticate, authorize(Role.HRD), validate(updateApplicationStatusSchema), updateApplicationStatus);
router.get("/society-history-company", authenticate, authorize(Role.HRD), getCompanyApplications);
router.delete("/delete-myApply/:id",authenticate, authorize(Role.Society), deleteApplication);

export default router;
