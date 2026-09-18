const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: [true, "Priority is required"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category"
    },
    labels: {
      type: [Schema.Types.ObjectId],
      ref: "label"
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);
const taskModel = mongoose.model("task", taskSchema);
module.exports = taskModel;
