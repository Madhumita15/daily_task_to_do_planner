const httpStatusCode = require("../utils/httpStatusCode");
const Task = require("../models/task.model");
const { default: mongoose } = require("mongoose");

class TaskController {
  async createTask(req, res) {
    try {
      const { title, description, priority, categoryId, labels, dueDate } =
        req.body;
      const id = req.user._id;
      console.log(req.body);
      console.log("labels", labels);
      const newTask = new Task({
        title: title,
        description: description,
        priority: priority,
        categoryId: categoryId,
        labels: labels,
        dueDate: dueDate,
        userId: id,
      });
      const task = await newTask.save();
      if (!task) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Task not created",
          data: null,
        });
      } else {
        return res.status(httpStatusCode.CREATED).json({
          success: true,
          message: "Task created successfully!",
          data: task,
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllTask(req, res) {
    try {
      const id = req.user._id;
      const { status, category, labels, dueDate } = req.query;

      const filter = {};
      if (status) {
        filter.status = status;
      }

      if (category) {
        filter.categoryId = new mongoose.Types.ObjectId(category);
      }

      if (labels) {
        const splittedLabels = labels
          .split(",")
          .map((label) => new mongoose.Types.ObjectId(label));
        filter.labels = {
          $in: splittedLabels,
        };
      }

      if (dueDate === "today") {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        filter.dueDate = {
          $gte: todayStart,
          $lt: tomorrowStart,
        };
      }

      if (dueDate === "tomorrow") {
        const tomorrowStart = new Date();
        tomorrowStart.setHours(0, 0, 0, 0);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);

        const dayAfterTomorrowStart = new Date(tomorrowStart);
        dayAfterTomorrowStart.setDate(dayAfterTomorrowStart.getDate() + 1);

        filter.dueDate = {
          $gte: tomorrowStart,
          $lt: dayAfterTomorrowStart,
        };
      }

      if (dueDate === "this week") {
        const thisWeekStart = new Date();
        thisWeekStart.setHours(0, 0, 0, 0);

        const day = thisWeekStart.getDay();

        const daysFromMonday = day === 0 ? 6 : day - 1;

        thisWeekStart.setDate(thisWeekStart.getDate() - daysFromMonday);

        const nextWeekStart = new Date(thisWeekStart);
        nextWeekStart.setDate(nextWeekStart.getDate() + 7);

        filter.dueDate = {
          $gte: thisWeekStart,
          $lt: nextWeekStart,
        };
      }
      const data = await Task.aggregate([
        {
          $match: { userId: id, ...filter },
        },
      ]);
      if (!data || data.length === 0) {
        return res.status(httpStatusCode.OK).json({
          success: true,
          message: "Task not found",
          data: [],
        });
      } else {
        return res.status(httpStatusCode.OK).json({
          success: true,
          message: "Task fetched successfull!",
          data: data,
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateTask(req, res) {
    try {
      const userId = req.user._id;
      const taskId = req.params.id;
      const { title, description, priority, categoryId, labels, dueDate } =
        req.body;

      const task = await Task.findOne({ _id: taskId, userId: userId });
      if (!task) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Task not found",
        });
      }

      task.title = title;
      task.description = description;
      task.priority = priority;
      task.categoryId = categoryId;
      task.labels = labels;
      task.dueDate = dueDate;

      const data = await task.save();
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Task updated successfully!",
        data: data,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteTask(req, res) {
    try {
      const taskId = req.params.id;
      const userId = req.user._id;

      const task = await Task.findOne({ _id: taskId, userId: userId });
      if (!task) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Task not found",
        });
      }

      await Task.findByIdAndDelete(taskId);
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Task deleted successfully!",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async markTaskCompleted(req, res) {
    try {
      const userId = req.user._id;
      const taskId = req.params.id;

      const task = await Task.findOne({ _id: taskId, userId: userId });
      if (!task) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Task not found",
        });
      }

      if (task.status === "completed") {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Task already marked as completed",
        });
      }

      task.status = "completed";
      const data = await task.save();

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Task marked as completed",
        data: data,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
module.exports = new TaskController();
