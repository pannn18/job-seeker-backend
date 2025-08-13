import { Router } from "express";
import { registerUser, loginUser, updateProfile } from "../../controllers/user/usercontroller";
import { addPosition, deletePosition, getApplicationsByPosition, updateApplicationStatus, updatePosition } from "../../controllers/aplly/applicationController";
import { authenticate, authorize } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validate";
import { loginSchema, registerSchema, updateUserSchema } from "../../validation/user.validation";

const router = Router();

// Registrasi & Login
router.post("/register-society", authorize("SOCIETY"), validate(registerSchema), registerUser);
router.post("/login-society", authorize("SOCIETY"), validate(loginSchema), loginUser);

//Update Profile
router.put("/update-profile/:id", authenticate, validate(updateUserSchema), updateProfile);


export default router;
