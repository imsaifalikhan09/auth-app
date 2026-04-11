const Slider = require("../models/sliderModel");

// &____________________getSliders________________
exports.getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: sliders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// &_______________New slider add(Admin side)______________

exports.createSlider = async (req, res) => {
  try {
    const newSlider = await Slider.create(req.body);
    res.status(201).json({
      success: true,
      data: newSlider,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
