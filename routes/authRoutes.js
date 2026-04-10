const express = require("express");
const router = express.Router();
const {
  requestOTP,
  verifyOTP,
  createAccount,
} = require("../controllers/authController");

router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/create-account", createAccount);

module.exports = router;
