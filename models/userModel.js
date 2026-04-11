// const mongoose = require("mongoose");
// const userSchema = new mongoose.Schema(
//   {
//     fullName: { type: String, required: false },
//     email: {
//       type: String,
//       sparse: true,
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         "Please provide a valid email address",
//       ],
//     },
//     phoneNumber: {
//       type: String,
//       required: [true, "Phone number is required"],
//       unique: true,
//       match: [/^[0-9]{10}$/, "Please valid 10-digit phone number"],
//     },
//     password: { type: String },
//     gender: { type: String, enum: ["Male", "Female", "Other"] },
//     isVerified: { type: Boolean, default: false },
//     otp: { type: String },
//     otpExpires: { type: Date },
//   },
//   { timestamps: true },
// );
// module.exports = mongoose.model("User", userSchema);

// &______________updateUserModel_______________
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: false },
    email: {
      type: String,
      sparse: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^[0-9]{10}$/, "Please valid 10-digit phone number"],
    },
    password: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    fcmToken: { type: String },
    deviceId: { type: String },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
