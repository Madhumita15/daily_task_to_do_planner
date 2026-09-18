const express = require("express");
const router = express.Router();
const validation = require("../validation/index");
const taskSchemaValidation = require("../validation/taskSchema.validation");
const authMiddleware = require("../middleware/auth.middleware");
const taskController = require("../controller/task.controller");

router.post(
  "/task",
  authMiddleware.verifyToken,
  validation.validate(taskSchemaValidation.taskOperation),
  taskController.createTask,
);
router.get(
  "/tasks",
  authMiddleware.verifyToken,
  validation.validate(taskSchemaValidation.taskOperation),
  taskController.getAllTask,
);

router.patch("/tasks/reorder", authMiddleware.verifyToken, taskController.reorderTasks)


router.put(
  "/task/:id",
  authMiddleware.verifyToken,
  validation.validate(taskSchemaValidation.taskOperation),
  taskController.updateTask,
);
router.delete(
  "/task/:id",
  authMiddleware.verifyToken,
  taskController.deleteTask,
);

router.patch("/task/:id", authMiddleware.verifyToken, taskController.markTaskCompleted)



module.exports = router;
