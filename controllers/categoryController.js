const Category = require("../models/categoryModel");
// &________________________getAllCategories____________________
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
    });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// &________________________Add New Category (Admin Side)____________________

exports.addCategory = async (req, res) => {
  try {
    const { name, iconUrl, order } = req.body;
    const category = await Category.create({ name, iconUrl, order });
    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
