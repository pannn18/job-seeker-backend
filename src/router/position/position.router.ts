import { Router } from "express";
import { validate } from "../../middleware/validate";
import { createAvailablePositionSchema, updateAvailablePositionSchema } from "../../validation/position.validation";
import { authenticate, authorize } from "../../middleware/authMiddleware";
import { createAvailablePosition, deleteAvailablePosition, getAvailablePositionById, getAvailablePositions, updateAvailablePosition } from "../../controllers/position/positionController";


const router = Router();

router.post("/", authenticate, authorize("HRD"), validate(createAvailablePositionSchema),createAvailablePosition);
router.get("/", authenticate, getAvailablePositions);
router.get("/:id",getAvailablePositionById);
router.put("/:id", authenticate, authorize("HRD"), validate(updateAvailablePositionSchema), updateAvailablePosition);
router.delete("/:id", authenticate, authorize("HRD"), deleteAvailablePosition);

export default router;
