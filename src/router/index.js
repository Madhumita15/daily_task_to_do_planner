const express = require('express')
const router = express.Router()
const authRouter = require('./auth.router')
const userRouter = require('./user.router')
const categoryRouter = require('./category.router')
const labelRouter = require('./label.router')
const taskRouter = require('./task.router')
const reminderRouter = require('./reminder.router')

router.use("/api/auth", authRouter)
router.use("/api/user", userRouter)
router.use("/api/user", categoryRouter)
router.use("/api/user", labelRouter)
router.use("/api/user", taskRouter)
router.use("/api/user", reminderRouter)

module.exports = router