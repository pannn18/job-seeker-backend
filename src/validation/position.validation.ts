import Joi from "joi";

/**
 * ✅ CREATE AvailablePosition Schema
 */
export const createAvailablePositionSchema = Joi.object({
  positionName: Joi.string().min(3).max(100).required(),
  capacity: Joi.number().integer().min(1).required(),
  description: Joi.string().allow("").optional(),
  submissionStartDate: Joi.date().iso().required(),
  submissionEndDate: Joi.date().iso().greater(Joi.ref("submissionStartDate")).required(),
});

/**
 * ✅ UPDATE AvailablePosition Schema
 * (semua field opsional, minimal 1 harus ada)
 */
export const updateAvailablePositionSchema = Joi.object({
  positionName: Joi.string().min(3).max(100).optional(),
  capacity: Joi.number().integer().min(1).optional(),
  description: Joi.string().allow("").optional(),
  submissionStartDate: Joi.date().iso().optional(),
  submissionEndDate: Joi.date().iso().optional(),
}).min(1); // wajib ada minimal 1 field
