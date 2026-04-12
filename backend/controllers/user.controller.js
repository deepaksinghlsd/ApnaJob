import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import crypto from "crypto";
import { sendOtpEmail } from "../utils/emailService.js";
import { generateProfileSummary } from "../utils/gemini.js";
import dotenv from "dotenv"
dotenv.config()

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const files = req.files;
    let profilePhotoUrl = "";
    let resumeUrl = "";
    let resumeOriginalName = "";

    if (files?.profilePhoto) {
      const fileUri = getDataUri(files.profilePhoto[0]);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    if (files?.resume) {
      const fileUri = getDataUri(files.resume[0]);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "raw",
      });
      resumeUrl = cloudResponse.secure_url;
      resumeOriginalName = files.resume[0].originalname;
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email.",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Generate initial summary if resume or skills present (skills usually empty at reg)
    const initialSummary = await generateProfileSummary([], "", role, resumeOriginalName);

    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhotoUrl,
        resume: resumeUrl,
        resumeOriginalName: resumeOriginalName,
        summary: initialSummary
      },
      isVerified: false,
      verificationOtp: otp,
      verificationOtpExpire: otpExpire
    });

    // Send OTP email
    await sendOtpEmail(email, otp, fullname);

    return res.status(201).json({
      message: "Verification OTP sent to your email. Please verify to continue.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Registration failed. " + error.message,
      success: false,
    });
  }
};

// Verify OTP for account activation
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required.",
                success: false
            });
        }

        const user = await User.findOne({ 
            email,
            verificationOtp: otp,
            verificationOtpExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired OTP.",
                success: false
            });
        }

        user.isVerified = true;
        user.verificationOtp = undefined;
        user.verificationOtpExpire = undefined;
        await user.save();

        return res.status(200).json({
            message: "Account verified successfully. You can now login.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Resend OTP
export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "Account is already verified.",
                success: false
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationOtp = otp;
        user.verificationOtpExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendOtpEmail(email, otp, user.fullname);

        return res.status(200).json({
            message: "OTP has been resent to your email.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    // check role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const files = req.files;

    let profilePhotoUrl, resumeUrl, resumeOriginalName;

    if (files?.profilePhoto) {
      const fileUri = getDataUri(files.profilePhoto[0]);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    if (files?.resume) {
      const fileUri = getDataUri(files.resume[0]);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "raw",
      });
      resumeUrl = cloudResponse.secure_url;
      resumeOriginalName = files.resume[0].originalname;
    }

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id; // middleware authentication
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }
    // updating data
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    if (profilePhotoUrl) {
      user.profile.profilePhoto = profilePhotoUrl;
    }

    if (resumeUrl) {
      user.profile.resume = resumeUrl;
      user.profile.resumeOriginalName = resumeOriginalName;
    }

    // AI summary generation
    if (skills || bio || resumeUrl) {
      const summary = await generateProfileSummary(
        user.profile.skills,
        user.profile.bio,
        user.role,
        user.profile.resumeOriginalName
      );
      if (summary) user.profile.summary = summary;
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      autoApplyEnabled: user.autoApplyEnabled
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

export const toggleAutoApply = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false
      });
    }

    user.autoApplyEnabled = !user.autoApplyEnabled;
    await user.save();

    return res.status(200).json({
      message: `Auto-apply ${user.autoApplyEnabled ? 'enabled' : 'disabled'} successfully.`,
      autoApplyEnabled: user.autoApplyEnabled,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required.",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found with this email.",
                success: false
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // Hash and set resetPasswordToken
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Set token expire time (e.g., 1 hour)
        user.resetPasswordExpire = Date.now() + 3600000;

        await user.save();

        const baseurl = process.env.BASE_URL || "https://lsd.qzz.io"

        // In a real app, send an email here. For now, we'll return the token in response (for demo) or log it.
        const resetUrl = `${baseurl}/reset-password/${resetToken}`;
        
        console.log(`Password reset link: ${resetUrl}`);

        return res.status(200).json({
            message: "Password reset link generated. Check console (demo) or implementation.",
            resetUrl, // Returning for ease of testing in this environment
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "New password is required.",
                success: false
            });
        }

        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token.",
                success: false
            });
        }

        // Set new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
