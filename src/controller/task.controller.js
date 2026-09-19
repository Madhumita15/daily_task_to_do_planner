const httpStatusCode = require("../utils/httpStatusCode");
const Task = require("../models/task.model");
const { default: mongoose } = require("mongoose");
const Category = require("../models/category.model");
const Labels = require("../models/label.model");

class TaskController {
  async createTask(req, res) {
    try {
      const { title, description, priority, categoryId, labels, dueDate } =
        req.body;
      const id = req.user._id;

      if (categoryId) {
        const category = await Category.findOne({
          _id: categoryId,
          userId: id,
        });
        if (!category) {
          return res.status(httpStatusCode.NOT_FOUND).json({
            success: false,
            message:
              "Category not found or your are not the owner of this category",
          });
        }
      }

      if (labels || labels.length > 0) {
        const userLabel = await Labels.find({
          userId: id,
          _id: { $in: labels },
        });
        if (userLabel.length !== labels.length) {
          return res.status(httpStatusCode.NOT_FOUND).json({
            success: false,
            message:
              "one or more labels not found or your are not the owner of this labels",
          });
        }
      }

      const lastTask = await Task.findOne({ userId: id }).sort({ order: -1 });
      const order = lastTask ? lastTask.order + 1 : 1;
      const newTask = new Task({
        title: title,
        description: description,
        priority: priority,
        categoryId: categoryId,
        labels: labels,
        dueDate: dueDate,
        userId: id,
        order: order,
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

      if (categoryId) {
        const category = await Category.findOne({
          _id: categoryId,
          userId: id,
        });
        if (!category) {
          return res.status(httpStatusCode.NOT_FOUND).json({
            success: false,
            message:
              "Category not found or your are not the owner of this category",
          });
        }
      }

      if (labels || labels.length > 0) {
        const userLabel = await Labels.find({
          userId: id,
          _id: { $in: labels },
        });
        if (userLabel.length !== labels.length) {
          return res.status(httpStatusCode.NOT_FOUND).json({
            success: false,
            message:
              "one or more labels not found or your are not the owner of this labels",
          });
        }
      }

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
      task.completedAt = new Date();
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

  async reorderTasks(req, res) {
    try {
      const userId = req.user._id;
      const { taskIds } = req.body;

      if (!Array.isArray(taskIds) || taskIds.length === 0) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "taskIds must be a non-empty array",
        });
      }

      const bulkOperations = taskIds.map((taskId, index) => ({
        updateOne: {
          filter: {
            _id: taskId,
            userId: userId,
          },
          update: {
            $set: {
              order: index + 1,
            },
          },
        },
      }));

      await Task.bulkWrite(bulkOperations);

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Tasks reordered successfully!",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async summeryOfTask(req, res) {
    try {
      const { type, date } = req.query;
      const id = req.user._id;

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);

      let dayEnd;

      if (type === "day") {
        dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
      } else if (type === "week") {
        const day = dayStart.getDay();
        const daysFromMonday = day === 0 ? 6 : day - 1;

        dayStart.setDate(dayStart.getDate() - daysFromMonday);

        dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 7);
      }

      const task = await Task.aggregate([
        {
          $match: {
            userId: id,
            dueDate: { $gte: dayStart, $lt: dayEnd },
          },
        },
        {
          $group: {
            _id: null,
            totalTask: { $sum: 1 },
            completedTask: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            pendingTask: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
          },
        },
      ]);

      const result = task[0] || {
        totalTask: 0,
        completedTask: 0,
        pendingTask: 0,
      };

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Task fetched successfully!",
        data: result,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async percentageTaskStatistics(req, res) {
    try {
      const { type, date } = req.query;
      const id = req.user._id;

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);

      let dayEnd;

      if (type === "day") {
        dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
      } else if (type === "week") {
        const day = dayStart.getDay();
        const daysFromMonday = day === 0 ? 6 : day - 1;

        dayStart.setDate(dayStart.getDate() - daysFromMonday);

        dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 7);
      }

      const task = await Task.aggregate([
        {
          $match: {
            userId: id,
            dueDate: { $gte: dayStart, $lt: dayEnd },
          },
        },
        {
          $group: {
            _id: null,
            totalTask: { $sum: 1 },
            completedTask: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
          },
        },
        {
          $set: {
            completionRate: {
              $multiply: [
                {
                  $divide: ["$completedTask", "$totalTask"],
                },
                100,
              ],
            },
          },
        },
      ]);

      const result = task[0] || {
        totalTask: 0,
        completedTask: 0,
        completionRate: 0,
      };

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Task fetched successfully!",
        data: result,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async averageTaskStatistics(req, res) {
    try {
      const id = req.user._id;

      const task = await Task.aggregate([
        {
          $match: {
            userId: id,
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            averageTime: {$avg: { $subtract: ["$completedAt", "$createdAt"] }}
          },
        },
        {
          $set: {averageTimeHours: {$round: {$divide: ["$averageTime", 1000 * 60 * 60]}}}
        },
        
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Task fetched successfully!",
        data: task,
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
