const httpStatusCode = require("../utils/httpStatusCode");
const cloudinary = require("../config/cloudinaryConfig");

class Validation {
  static validate(schema) {
    return async (req, res, next) => {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        if (req.file) {
          await cloudinary.uploader.destroy(req.file.filename);
        }
        console.log("error", error);
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          errors: error.details.map((err) => ({
            field: err.path.join("."),
            error: err.message,
          })),
        });
      }

      req.body = value;
      next();
    };
  }
}
module.exports = Validation;
