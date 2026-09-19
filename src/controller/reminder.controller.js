const httpStatusCode = require("../utils/httpStatusCode");
const Reminder = require("../models/reminder.model");
const Task = require('../models/task.model')

class ReminderController {
  async createReminder(req, res) {
    try {
      const userId = req.user._id;
      const taskId = req.params.id;
      const { reminderTime, reminderType } = req.body;

     const task = await Task.findOne({_id: taskId, userId: userId})
     if(!task){
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Task not found or you are not the owner of this task",
        });

     }

      const existingRemninder = await Reminder.findOne({
        userId: userId,
        taskId: taskId,
      });
      if (existingRemninder) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "You already set reminder for this task",
        });
      }

      const newReminder = new Reminder({
        taskId: taskId,
        userId: userId,
        reminderTime: reminderTime,
        reminderType: reminderType,
        isActive: true,
      });

      await newReminder.save();
      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Reminder set successfully!",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateReminder(req, res) {
    try {
      const userId = req.user._id;
      const taskId = req.params.id;
      const { reminderTime, reminderType } = req.body;

      const remninder = await Reminder.findOne({
        userId: userId,
        taskId: taskId,
      });
      if (!remninder) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Reminder not found",
        });
      }

      remninder.reminderTime = reminderTime;
      remninder.reminderType = reminderType;

      await remninder.save();
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Reminder updated successfully!",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteReminder(req, res) {
    try {
      const userId = req.user._id;
      const taskId = req.params.id;

      const remninder = await Reminder.findOne({
        userId: userId,
        taskId: taskId,
      });
      if (!remninder) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Reminder not found",
        });
      }

      await remninder.deleteOne();
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Reminder deleted successfully!",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ReminderController();
