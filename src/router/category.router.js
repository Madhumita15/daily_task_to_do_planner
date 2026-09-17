const express = require('express')
const router = express.Router()
const categoryController = require('../controller/category.controller')
const validation = require('../validation/index')
const categorySchemaValidation = require('../validation/categorySchema.validation')
const authMiddleware = require('../middleware/auth.middleware')

router.post("/category",authMiddleware.verifyToken,validation.validate(categorySchemaValidation.categoryOperation) ,categoryController.createCategory)
router.get("/categories",authMiddleware.verifyToken,categoryController.getAllCategory)
router.put("/category/:id", authMiddleware.verifyToken,validation.validate(categorySchemaValidation.categoryOperation), categoryController.updateCategory)
router.delete("/category/:id", authMiddleware.verifyToken,categoryController.deleteCategory)



module.exports = router