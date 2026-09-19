const cron = require("node-cron");
const Reminder = require("../models/reminder.model");
const SendMail = require("../utils/sendMail");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const reminders = await Reminder.aggregate([
      {
        $match: {
          isActive: true,
          reminderTime: { $lte: now },
        },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "taskId",
          foreignField: "_id",
          as: "tasks",
        },
      },
      {
        $unwind: "$tasks",
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $unwind: "$users",
      },
      {
        $project: {
          _id: 1,
          reminderType: 1,
          reminderTime: 1,
          isActive: 1,
          "tasks.title": 1,
          "tasks.priority": 1,
          "tasks.dueDate": 1,
          "users._id": 1,
          "users.email": 1,
          "users.name": 1,
        },
      },
    ]);

    for (const reminder of reminders) {
      await SendMail.remderMail(reminder);
      if (reminder.reminderType === "once") {
        await Reminder.updateOne(
          { _id: reminder._id },
          { $set: { isActive: false } },
        );
      } else if (reminder.reminderType === "daily") {
        const nextReminderTime = new Date(reminder.reminderTime);
        nextReminderTime.setDate(nextReminderTime.getDate() + 1);

        await Reminder.updateOne(
          { _id: reminder._id },
          { $set: { reminderTime: nextReminderTime } },
        );
      } else if (reminder.reminderType === "weekly") {
        const nextReminderTime = new Date(reminder.reminderTime);
        nextReminderTime.setDate(nextReminderTime.getDate() + 7);

        await Reminder.updateOne(
          { _id: reminder._id },
          { $set: { reminderTime: nextReminderTime } },
        );
      }
    }
  } catch (error) {
    console.error("Reminder job error:", error);
  }
});
