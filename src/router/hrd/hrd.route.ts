import { Router } from "express";
import { registerUser, loginUser, updateProfile } from "../../controllers/user/usercontroller";
import { addPosition, deletePosition, getApplicationsByPosition, updateApplicationStatus, updatePosition } from "../../controllers/aplly/applicationController";
import { authenticate, authorize } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validate";
import { loginSchema, registerSchema, updateUserSchema } from "../../validation/user.validation";

const router = Router();

// Registrasi & Login
router.post("/register-hrd", authorize("HRD"), validate(registerSchema), registerUser);
router.post("/login-hrd", authorize("HRD"), validate(loginSchema), loginUser);

//Update Profile
router.put("/update-profile/:id", authenticate, validate(updateUserSchema), updateProfile);

// Tambah posisi (HRD only)
router.post("/positions", authenticate, authorize("HRD"), addPosition);

// Hapus posisi (HRD only)
router.delete("/positions/:id", authenticate, authorize("HRD"), deletePosition);

// Lihat pelamar
router.get("/applications/:positionId", authenticate, authorize("HRD"), getApplicationsByPosition);

// Ubah status lamaran
router.patch("/applications/:id/status", authenticate, authorize("HRD"), updateApplicationStatus);

export default router;
