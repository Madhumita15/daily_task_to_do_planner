const joi = require('joi')

class LabelSchema{
    static labelOperation = joi.object({
        name: joi.string().trim().required().messages({
            "string.empty": "Name is required",
            "any.required": "Name is required"
        })
    })

}

module.exports = LabelSchema