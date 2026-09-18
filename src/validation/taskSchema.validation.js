const joi = require("joi");

class TaskSchema {
  static taskOperation = joi.object({
    title: joi.string().trim().required().messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
    }),
    description: joi.string().trim().required().messages({
      "string.empty": "Description is required",
      "any.required": "Description is required",
    }),
    priority: joi
      .string()
      .trim()
      .valid("Low", "Medium", "High")
      .required()
      .messages({
        "string.empty": "Priority is required",
        "any.only": "Priority must be one of Low, Medium, High",
        "any.required": "Priority is required",
      }),
    dueDate: joi.date().required().messages({
      "date.empty": "Duedate is required",
      "any.required": "Duedate is required",
    }),
    categoryId: joi.string().optional(),
    labels: joi.array().optional()
  });
}

module.exports = TaskSchema;
