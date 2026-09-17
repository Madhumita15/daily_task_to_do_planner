const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const labelSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);

const labelModel = mongoose.model("label", labelSchema);
module.exports = labelModel;
