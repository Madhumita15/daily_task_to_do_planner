const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },
    profile_image: {
        type: String
    },
    profile_public_id: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false

    }
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
