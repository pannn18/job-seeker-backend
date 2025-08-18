import { Router } from "express";
import { validate } from "../../middleware/validate";
import { createAvailablePositionSchema, updateAvailablePositionSchema } from "../../validation/position.validation";
import { authenticate, authorize } from "../../middleware/authMiddleware";
import { createAvailablePosition, deleteAvailablePosition, getAvailablePositionById, getAvailablePositions, updateAvailablePosition } from "../../controllers/position/positionController";


const router = Router();

router.post("/add-position", authenticate, authorize("HRD"), validate(createAvailablePositionSchema),createAvailablePosition);
router.get("/position-view", getAvailablePositions);
router.get("/position-view/:id", authenticate, getAvailablePositionById);
router.put("/update-position/:id", authenticate, authorize("HRD"), validate(updateAvailablePositionSchema), updateAvailablePosition);
router.delete("/:id", authenticate, authorize("HRD"), deleteAvailablePosition);

export default router;
