// validation/user.validation.ts
import Joi from "joi";

// Schema register
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("HRD", "Society").optional(),

  // Field tambahan untuk HRD
  companyName: Joi.string()
    .min(3)
    .max(255)
    .when("role", { is: "HRD", then: Joi.required(), otherwise: Joi.forbidden() }),
  companyAddress: Joi.string()
    .min(5)
    .max(255)
    .when("role", { is: "HRD", then: Joi.required(), otherwise: Joi.forbidden() }),
  companyPhone: Joi.string()
    .pattern(/^[0-9]{8,15}$/)
    .when("role", { is: "HRD", then: Joi.required(), otherwise: Joi.forbidden() }),
  companyDescription: Joi.string()
    .max(500)
    .when("role", { is: "HRD", then: Joi.optional(), otherwise: Joi.forbidden() }),

  // Field tambahan untuk Society
  address: Joi.string()
    .min(5)
    .max(255),
  dateOfBirth: Joi.date(),
  gender: Joi.string()
    .valid("Male", "Female")
});

// Schema login
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("HRD", "Society").optional(),
});

//schema update
export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
}).min(1); // Minimal harus ada 1 field yang diupdate
