const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { sendOTP, verifyOTP } = require('../controllers/otpController');

router.get('/events', apiController.getEvents);
router.post('/email', apiController.submitEmail);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);


module.exports = router;
