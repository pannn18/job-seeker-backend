import express from "express";
import { validate } from "../../middleware/validate";
import { createSocietySchema, societyIdSchema, updateSocietySchema } from "../../validation/society.validation";
import { createSociety, updateSociety } from "../../controllers/society/societyController";


const router = express.Router();

router.post("/add-society", validate(createSocietySchema), createSociety);
router.get("/:id", validate(societyIdSchema), );
router.put("/:id", validate(updateSocietySchema), updateSociety);

export default router;