import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sends a 6-digit OTP email for account verification.
 * @param {string} email - Recipient email.
 * @param {string} otp - The 6-digit OTP code.
 * @param {string} fullname - Recipient's full name.
 */
export const sendOtpEmail = async (email, otp, fullname) => {
    try {
        const mailOptions = {
            from: `"ApnaJob Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify Your ApnaJob Account",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; color: #333;">
                    <div style="background-color: #6a11cb; padding: 40px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Verify Your Identity</h1>
                        <p style="margin-top: 10px; opacity: 0.9; font-size: 16px;">Step into your future with ApnaJob</p>
                    </div>
                    <div style="padding: 40px; background-color: #ffffff;">
                        <p style="font-size: 18px; font-weight: 600; margin-bottom: 20px;">Hello ${fullname},</p>
                        <p style="font-size: 15px; line-height: 1.6; color: #666; margin-bottom: 30px;">
                            We're excited to have you on board! To finish setting up your account, please use the 6-digit verification code below. This code is valid for **10 minutes**.
                        </p>
                        <div style="text-align: center; margin-bottom: 40px;">
                            <div style="display: inline-block; background-color: #f8f9fa; border: 2px dashed #6a11cb; border-radius: 12px; padding: 20px 40px;">
                                <span style="font-size: 36px; font-weight: 900; color: #6a11cb; letter-spacing: 12px;">${otp}</span>
                            </div>
                        </div>
                        <div style="background-color: #f3f0ff; border-left: 4px solid #6a11cb; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                            <h3 style="margin-top: 0; color: #6a11cb; font-size: 15px;">Why use ApnaJob?</h3>
                            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #555; line-height: 1.8;">
                                <li><strong>Global AI Discovery:</strong> Search thousands of job boards instantly.</li>
                                <li><strong>Precision Matching:</strong> Advanced algorithms rank jobs by your skills.</li>
                                <li><strong>Smart Tracking:</strong> Manage your entire career journey in one dashboard.</li>
                            </ul>
                        </div>
                        <p style="font-size: 13px; color: #999; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #e0e0e0;">
                        &copy; ${new Date().getFullYear()} ApnaJob Inc. All rights reserved.
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP Email sent to: ${email}`);
    } catch (error) {
        console.error("Error sending OTP email:", error);
        throw new Error("Failed to send verification email.");
    }
};
