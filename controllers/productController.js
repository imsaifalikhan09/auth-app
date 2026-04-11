const Product = require("../models/productModel");

// &____________________Get products for "Big Deals" (With Limit for Home Screen)__________

exports.getBigDeals = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;

    const products = await Product.find({ isBigDeal: true })
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// &_________________________getRecommendations__________
exports.getRecommendations = async (req, res) => {
  try {
    const products = await Product.find({ isRecommended: true });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// &__________________Add New Product (Admin)______________
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// &__________________Search Products___________________

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).limit(10);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
