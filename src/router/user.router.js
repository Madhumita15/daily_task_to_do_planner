const express = require('express')
const router = express.Router()
const userController = require('../controller/user.controller')
const authMiddleware = require('../middleware/auth.middleware')
const upload = require('../utils/cloudinary')
const httpStatusCode = require('../utils/httpStatusCode')
const validation = require('../validation/index')
const userSchemaValidation = require('../validation/userSchema.validation')

const uploadMiddleware = (req, res, next)=>{
    upload.single("profile_image")(req, res, (err)=>{
        if(err){
            return res.status(httpStatusCode.BAD_REQUEST).json({
                success: false,
                message: err.message
            })
        }
        next()
    })

}

router.get("/profile",authMiddleware.verifyToken ,userController.getUserProfile)
router.put("/profile",authMiddleware.verifyToken, uploadMiddleware,validation.validate(userSchemaValidation.updateProfile), userController.updateProfile)


module.exports = router