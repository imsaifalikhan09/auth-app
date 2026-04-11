const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  addCategory,
} = require("../controllers/categoryController");

router.get("/getAllCategories", getAllCategories);
router.post("/addCategory", addCategory);

module.exports = router;
