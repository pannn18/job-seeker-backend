// validation/society.validation.ts
import e from "express";
import Joi from "joi";

// CREATE Society
export const createSocietySchema = Joi.object({
  userId: Joi.number().integer().required(), 
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(5).max(255).required(),
  phone: Joi.string().pattern(/^[0-9]{8,15}$/).required(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().valid("Male", "Female").required(),
});

// UPDATE Society
export const updateSocietySchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  address: Joi.string().min(5).max(255).optional(),
  phone: Joi.string().pattern(/^[0-9]{8,15}$/).optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid("Male", "Female").optional(),
}).min(1); // minimal harus ada satu field yang diupdate

// GET by ID / DELETE by ID (params validation)
export const societyIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});
