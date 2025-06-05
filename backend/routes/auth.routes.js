const express = require('express')
const router = express.Router()
const {signup , verifyOTP , resendOtp, login, logout, forgotPassword, resetPassword } = require('../controllers/auth.controller')


router.post('/signup' , signup)
router.post('/verify-otp' , verifyOTP)
router.post("/resendOtp", resendOtp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);


module.exports = router