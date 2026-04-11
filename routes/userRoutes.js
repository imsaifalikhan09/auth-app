const express = require("express");
const router = express.Router();
const { updateUserDeviceData } = require("../controllers/authController");

router.post("/update-device-info", updateUserDeviceData);

module.exports = router;
