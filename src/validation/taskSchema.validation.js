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

  static reminderOperation = joi.object({
    reminderType: joi.string().valid("once", "daily", "weekly").required().messages({
      "string.empty": "Task reminder is required",
      "any.only": "Reminder Types must be one of once, daily, weekly",
      "any.required": "Task reminder is required"

    }),
    reminderTime: joi.date().required().messages({
      "date.base": "Reminder Time must be valid date",
      "any.required": "Reminder Time is required"
    })
  })
}

module.exports = TaskSchema;
