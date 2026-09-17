const express = require('express')
const router = express.Router()
const authRouter = require('./auth.router')
const userRouter = require('./user.router')
const categoryRouter = require('./category.router')
const labelRouter = require('./label.router')

router.use("/api/auth", authRouter)
router.use("/api/user", userRouter)
router.use("/api/user", categoryRouter)
router.use("/api/user", labelRouter)

module.exports = router