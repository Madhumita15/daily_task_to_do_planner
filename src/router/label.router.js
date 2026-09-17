const express = require('express')
const router = express.Router()
const labelController = require('../controller/label.controller')
const validation = require('../validation/index')
const labelSchemaValidation = require('../validation/labelSchema.validation')
const authMiddleware = require('../middleware/auth.middleware')

router.post("/label",authMiddleware.verifyToken, validation.validate(labelSchemaValidation.labelOperation),labelController.createLabel)
router.get("/labels",authMiddleware.verifyToken , labelController.getAllLabel)


module.exports = router