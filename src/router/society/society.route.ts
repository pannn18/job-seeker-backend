import express from "express";
import { validate } from "../../middleware/validate";
import { createSocietySchema, societyIdSchema, updateSocietySchema } from "../../validation/society.validation";
import { createSociety, getSocietyById, updateSociety } from "../../controllers/society/societyController";


const router = express.Router();

router.post("/add-society", validate(createSocietySchema), createSociety);
router.get("/:id", getSocietyById);
router.put("/update-society/:id", validate(updateSocietySchema), updateSociety);

export default router;