const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    category: { type: String },
    link: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Slider", sliderSchema);
