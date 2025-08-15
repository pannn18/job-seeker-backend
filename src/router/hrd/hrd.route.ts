import { Router } from "express";
import { registerUser, loginUser, updateProfile, getProfile, deleteProfile } from "../../controllers/user/usercontroller";
import { authenticate, authorize } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validate";
import { loginSchema, registerSchema, updateUserSchema } from "../../validation/user.validation";

const router = Router();

router.post("/register-hrd", validate(registerSchema), registerUser);
router.post("/login-hrd", validate(loginSchema), loginUser);
router.put("/update-profile/:id", authenticate, validate(updateUserSchema), updateProfile);
router.get("/profile-hrd/:id", authenticate, authorize("HRD"), getProfile);
router.delete("/profile-hrd/:id", authenticate, authorize("HRD"), deleteProfile);

export default router;
