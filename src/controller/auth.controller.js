const httpStatusCode = require("../utils/httpStatusCode");
const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const SendEMail = require("../utils/sendMail");
const Otp = require("../models/otp.model");
const jwt = require("jsonwebtoken");

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Email already exists",
        });
      }

      const salt = 10;
      const hashPassword = await bcryptjs.hash(password, salt);

      const newUser = new User({
        name: name,
        password: hashPassword,
        email: email,
      });

      const user = await newUser.save();
      await SendEMail.verifyEmail(req, user);
      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "User created account successfully and send otp to your email",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifymail(req, res) {
    try {
      const { otp, email } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User Not found",
        });
      }

      if (user.isEmailVerified) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Email is already verified",
        });
      }

      const emailVerification = await Otp.findOne({
        otp: otp,
        userId: user._id,
      });

      if (!emailVerification) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid Otp, try again!",
        });
      }

      const currentTime = Date.now();
      const expirationTime =
        emailVerification.createdAt.getTime() + 15 * 60 * 1000;
      if (currentTime > expirationTime) {
        await SendEMail.verifyEmail(req, user);
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Otp Expired , new otp send to your email",
        });
      }

      user.isEmailVerified = true;
      await user.save();
      await Otp.deleteMany({userId: user._id})
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Email verified successfully!",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { password, email } = req.body;
      const user = await User.findOne({
        email: email,
      });
      if (!user) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "User not found",
        });
      }
      
      const isMatch = await bcryptjs.compare(password, user.password);

      if (!isMatch) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid Credentials",
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" },
      );

      return res.status(httpStatusCode.OK).json({
        success: false,
        message: "Successfully Login",
        token: token,
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
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
module.exports = new AuthController();
