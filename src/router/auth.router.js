const express = require('express')
const router = express.Router()
const userController = require('../controller/auth.controller')
const validation = require('../validation/index')
const userSchemaValidation = require('../validation/userSchema.validation')

router.post("/register",validation.validate(userSchemaValidation.register),userController.register)
router.post("/verify-email", validation.validate(userSchemaValidation.verifyEmail), userController.verifymail)
router.post("/login", validation.validate(userSchemaValidation.login), userController.login)


module.exports = router