const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  otp: {
    type: String,
    required: [true, "OTP is required"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    expires: "15m",
    default: Date.now,
  },
});

const otpModel = mongoose.model("otp", otpSchema);
module.exports = otpModel;
