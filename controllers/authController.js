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
    // Note: Yahan par actual SMS gateway (like Twilio/Firebase) integrate hoga
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Sorry something went wrong", error });
  }
};
// &______________________verifyOtp______________________

// exports.verifyOTP = async (req, res) => {
//   const { phoneNumber, otp } = req.body;
//   try {
//     const user = await User.findOne({
//       phoneNumber,
//       otp,
//       otpExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid or expired OTP" });
//     }
//     user.otp = undefined;
//     user.otpExpires = undefined;
//     user.isVerified = true;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "OTP Verified",
//       newUser: !user.fullName,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Verification failed" });
//   }
// };

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

    // 2. OTP reset karein aur verification status update karein
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();

    // 3. JWT Token Generate Karein
    // Hum payload mein userId bhej rahe hain taaki baad mein pehchan sakein
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // 7 din ki validity (Professional standard)
    );

    res.cookie("jwn", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 4. Response bhejien
    res.status(200).json({
      success: true,
      message: "OTP Verified successfully",
      token, // Flutter developer ise local storage mein save karega
      newUser: !user.fullName, // Agar fullName nahi hai, toh user ko profile setup par bhejo
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
