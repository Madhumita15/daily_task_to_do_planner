const Label = require("../models/label.model");
const httpStatusCode = require("../utils/httpStatusCode");

class LabelController {
  async createLabel(req, res) {
    try {
      const { name } = req.body;
      const id = req.user._id;
      const label = await Label.findOne({ name: name, userId: id });
      if (label) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Label already created",
        });
      }
      const newLabel = new Label({
        name: name,
        userId: id,
      });
      const data = await newLabel.save();
      if (!data) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Label not created",
          data: null,
        });
      } else {
        return res.status(httpStatusCode.CREATED).json({
          success: true,
          message: "Label created successfully!",
          data: data,
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllLabel(req, res) {
    try {
      const id = req.user._id;
      const data = await Label.find({ userId: id });
      if (data.length === 0) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Label not found",
          data: [],
        });
      } else {
        return res.status(httpStatusCode.OK).json({
          success: true,
          message: "Label fetched successfully!",
          data: data,
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new LabelController();
