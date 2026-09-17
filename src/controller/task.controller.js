const httpStatusCode = require("../utils/httpStatusCode");
const Task = require("../models/task.model");

class TaskController {
  async createTask(req, res) {
    try {
      const { title, description, priority, categoryId, labels, dueDate } =
        req.body;
      const newTask = new Task({
        title: title,
        description: description,
        priority: priority,
        categoryId: categoryId,
        labels: labels,
        dueDate: dueDate,
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
      const data = await Task.find({ userId: id });
      if (!data || data.length === 0) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
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
      const { title, description, priority, categoryId, labels, dueDate } = req.body;

      const task = await Task.findOne({ _id: taskId, userId: userId });
      if (!task) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Task not found",
        });
      }

      task.title = title
      task.description = description
      task.priority = priority
      task.categoryId = categoryId
      task.labels = labels
      task.dueDate = dueDate
      
      const data = await task.save()
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Task updated successfully!",
        data: data
      })


    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
module.exports = new TaskController();
