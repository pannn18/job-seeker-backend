import express from 'express';
import { applyToPosition } from "../controllers/societyController";

const router = express.Router();

// Endpoint untuk Society melamar
router.post('/apply', applyToPosition);

export default router;
