const cron = require("node-cron");
const User = require("../models/user.model");
const Task = require("../models/task.model");
const SendMail = require("../utils/sendMail");

cron.schedule("* * * * *", async () => {
  try {
    const users = await User.find();

    const now = new Date();

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    for (const user of users) {
      const overdueTasks = await Task.find({
        userId: user._id,
        status: "pending",
        dueDate: { $lt: now },
      });

      const upcomingTasks = await Task.find({
        userId: user._id,
        status: "pending",
        dueDate: {
          $gte: now,
          $lt: tomorrow,
        },
      });

      const completedTasks = await Task.find({
        userId: user._id,
        status: "completed",
        completedAt: {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lt: tomorrow,
        },
      });

    

      await SendMail.dailyTaskSummary(
        user,
        overdueTasks,
        upcomingTasks,
        completedTasks,
      );
    }
  } catch (error) {
    console.error("Daily task summary job error:", error);
  }
});
