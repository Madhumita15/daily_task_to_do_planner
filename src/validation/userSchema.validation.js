const joi = require("joi");

class UserSchemaValidation {
  static register = joi.object({
    name: joi.string().trim().required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),
    email: joi.string().trim().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email",
      "any.required": "Email is required",
    }),
    password: joi.string().trim().min(6).max(15).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6",
      "string.max": "Password should not exceed 15",
      "any.required": "Password is required",
    })
  });

  static login = joi.object({
    email: joi.string().trim().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email",
      "any.required": "Email is required",
    }),
    password: joi.string().trim().required().messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  });

  static verifyEmail = joi.object({
    email: joi.string().trim().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email",
      "any.required": "Email is required",
    }),
    otp: joi.string().min(4).max(4).required().messages({
      "string.empty": "otp is required",
      "string.min": "otp must be at least 4 digits",
      "string.max": "otp should not exceed 4 digits",
      "any.required": "otp is required",
    }),
  });


  static updateProfile = joi.object({
    email: joi.string().trim().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email",
      "any.required": "Email is required"
    }),
    name: joi.string().trim().required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required"
    })
  })
 
  

 
}
module.exports = UserSchemaValidation;
