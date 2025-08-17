import { Router } from "express";
import { registerUser, loginUser, updateProfile, getProfile, deleteProfile } from "../../controllers/user/usercontroller";
import { authenticate, authorize } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validate";
import { loginSchema, registerSchema, updateUserSchema } from "../../validation/user.validation";

const router = Router();

//user
router.post("/register-user", validate(registerSchema), registerUser);
router.post("/login-user", validate(loginSchema), loginUser);
router.put("/update-profile/:id", authenticate, authorize("Society"), validate(updateUserSchema), updateProfile);
router.get("/profile-user/:id", authenticate, authorize("Society"), getProfile);
router.delete("/delete-profile/:id", authenticate, authorize("Society"), deleteProfile);


export default router;
