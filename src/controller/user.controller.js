const User = require("../models/user.model");
const httpStatusCode = require("../utils/httpStatusCode");
const cloudinary = require("../config/cloudinaryConfig");

class UserController {
  async getUserProfile(req, res) {
    try {
      const id = req.user._id;
      const user = await User.findById(id);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
          data: null,
        });
      } else {
        return res.status(httpStatusCode.OK).json({
          success: true,
          message: "User profile gets successfully!",
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profile_image: user.profile_image,
            isEmailVerified: user.isEmailVerified,
          },
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const { email, name } = req.body;
      const id = req.user._id;
      const user = await User.findById(id);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      user.email = email;
      user.name = name;

      if (req.file) {
        if (user.profile_image) {
          await cloudinary.uploader.destroy(user.profile_public_id);
        }
        user.profile_image = req.file.path;
        user.profile_public_id = req.file.filename;
      }
      await user.save();

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "User update successfully!",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          profile_image: user.profile_image,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
module.exports = new UserController();
