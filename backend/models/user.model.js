import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'}, 
        profilePhoto:{
            type:String,
            default:""
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationOtp: {
        type: String
    },
    verificationOtpExpire: {
        type: Date
    },
    resetPasswordToken: {type: String},
    resetPasswordExpire: {type: Date}
}, {timestamps:true});

export const User = mongoose.model('User', userSchema);