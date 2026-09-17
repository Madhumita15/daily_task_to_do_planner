const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"]
    },
    description: {
        type: String,
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true
})

const categoryModel = mongoose.model("category", categorySchema)
module.exports = categoryModel