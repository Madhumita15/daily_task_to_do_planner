const Category = require("../models/category.model");
const httpStatusCode = require("../utils/httpStatusCode");

class CategoryController {
  async createCategory(req, res) {
    try {
      const { name, description } = req.body;
      const id = req.user._id;

      const category = await Category.findOne({ name: name, userId: id });
      if (category) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Category already created",
        });
      }

      const newCategory = new Category({
        name: name,
        description: description,
        userId: id,
      });

      const data = await newCategory.save();
      if (!data) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Category not created",
          data: null
        });
      } else {
        return res.status(httpStatusCode.CREATED).json({
          success: true,
          message: "Category created successfully!",
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

  async getAllCategory(req, res) {
    try {
      const id = req.user._id;
      const data = await Category.find({ userId: id });
      if (data.length === 0) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Category not found",
          data: [],
        });
      } else {
        return res.status(httpStatusCode.OK).json({
          success: true,
          message: "Category fetched successfully!",
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

  async updateCategory(req, res) {
    try {
      const userId = req.user._id;
      const categoryId = req.params.id;
      const { name, description } = req.body;

      const category = await Category.findOne({
        _id: categoryId,
        userId: userId,
      });
      if (!category) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Category not found",
        });
      }

      category.name = name;
      category.description = description;

      const data = await category.save();
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Category updated successfully!",
        data: data,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteCategory(req, res) {
    try {
      const categoryId = req.params.id;
      const userId = req.user._id;

      const category = await Category.findOne({
        _id: categoryId,
        userId: userId,
      });
      if (!category) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Category not found",
        });
      }

      await Category.findByIdAndDelete(categoryId);
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Category deleted successfully!",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new CategoryController();
