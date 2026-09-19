const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reminderSchema = new Schema({
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "task",
    required: true
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  reminderType: {
    type: String,
    enum: ["once", "daily", "weekly"],
    required: true
  },

  reminderTime: {
    type: Date,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }
});

const reminderModel = mongoose.model("reminder", reminderSchema)
module.exports = reminderModel