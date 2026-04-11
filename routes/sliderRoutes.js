const express = require("express");
const router = express.Router();
const { getSliders, createSlider } = require("../controllers/sliderController");

router.get("/get-sliders", getSliders);
router.post("/add-slider", createSlider);

module.exports = router;
