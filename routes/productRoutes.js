const express = require("express");
const router = express.Router();
const {
  getBigDeals,
  getRecommendations,
  addProduct,
} = require("../controllers/productController");
const { searchProducts } = require("../controllers/productController");

router.get("/getBigDeals", getBigDeals);
router.get("/recommended", getRecommendations);
router.post("/addProduct", addProduct);
router.get("/search", searchProducts);

module.exports = router;
