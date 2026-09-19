const express = require("express");
const router = express.Router();
const validation = require("../validation/index");
const taskSchemaValidation = require("../validation/taskSchema.validation");
const authMiddleware = require("../middleware/auth.middleware");
const reminderController = require("../controller/reminder.controller");

router.post(
  "/task/:id/reminder",
  authMiddleware.verifyToken,
  validation.validate(taskSchemaValidation.reminderOperation),
  reminderController.createReminder,
);

router.put(
  "/task/:id/reminder",
  authMiddleware.verifyToken,
  validation.validate(taskSchemaValidation.reminderOperation),
  reminderController.updateReminder,
);


router.delete(
  "/task/:id/reminder",
  authMiddleware.verifyToken,
  reminderController.deleteReminder,
);

module.exports = router;
