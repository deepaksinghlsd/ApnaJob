import express from "express";
import {
    forgotPassword,
    login,
    logout,
    register,
    resetPassword,
    updateProfile,
    verifyOtp,
    resendOtp,
    toggleAutoApply
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { multiUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(multiUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, multiUpload, updateProfile);
router.route("/toggle-auto-apply").post(isAuthenticated, toggleAutoApply);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

// OTP Verification
router.route("/verify-otp").post(verifyOtp);
router.route("/resend-otp").post(resendOtp);

export default router;
