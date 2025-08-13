import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user/usercontroller";
import { addPosition, deletePosition, getApplicationsByPosition, updateApplicationStatus, updatePosition } from "../controllers/aplly/applicationController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

// Registrasi & Login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Tambah posisi (HRD only)
router.post("/positions", authenticate, authorize("HRD"), addPosition);

// Hapus posisi (HRD only)
router.delete("/positions/:id", authenticate, authorize("HRD"), deletePosition);

// Lihat pelamar
router.get("/applications/:positionId", authenticate, authorize("HRD"), getApplicationsByPosition);

// Ubah status lamaran
router.patch("/applications/:id/status", authenticate, authorize("HRD"), updateApplicationStatus);

export default router;
