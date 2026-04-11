const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// &_________________________requestOtp________________________

exports.requestOTP = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
    }
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    // Note: actual SMS gateway (like Twilio/Firebase)
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Sorry something went wrong", error });
  }
};
// &______________________verifyOtp______________________

exports.verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const user = await User.findOne({
      phoneNumber,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwn", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "OTP Verified successfully",
      token,
      newUser: !user.fullName,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};
// &______________________createAccrount__________________
exports.createAccount = async (req, res) => {
  const { fullName, email, phoneNumber, password, gender } = req.body;
  try {
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number not verified" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.fullName = fullName;
    user.email = email;
    user.password = hashedPassword;
    user.gender = gender;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.otp;
    delete userResponse.otpExpires;

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sorry Account not Created",
      error: error.message,
    });
  }
};
// &______________________updateUserDeviceData_________________

// Sirf User ka background data (Location, Device ID, FCM) update karne ke liye
exports.updateUserDeviceData = async (req, res) => {
  try {
    const { phoneNumber, fcmToken, deviceId, latitude, longitude } = req.body;

    // Hum phoneNumber se user dhundenge kyunki aapka purana model use unique manta hai
    const user = await User.findOneAndUpdate(
      { phoneNumber: phoneNumber },
      {
        fcmToken,
        deviceId,
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        lastActive: Date.now(),
      },
      { new: true }, // Taaki humein update ke baad ka data mile
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User background data updated!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
