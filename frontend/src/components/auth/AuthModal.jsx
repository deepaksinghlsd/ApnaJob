import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2, Mail, Lock, User, Phone, Image as ImageIcon, Eye, EyeOff, FileText } from 'lucide-react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { closeModal, setView } from '@/redux/authModalSlice';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal = () => {
    const dispatch = useDispatch();
    const { isOpen, view } = useSelector(store => store.authModal);
    const { loading } = useSelector(store => store.auth);
    
    const [signupEmail, setSignupEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    const [loginInput, setLoginInput] = useState({
        email: "",
        password: "",
        role: "student",
    });

    const [signupInput, setSignupInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student",
        profilePhoto: null,
        resume: null,
    });

    const onOpenChange = (open) => {
        if (!open) dispatch(closeModal());
    };

    const loginChangeHandler = (e) => {
        setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
    };

    const signupChangeHandler = (e) => {
        setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
    };

    const signupFileHandler = (e, type) => {
        setSignupInput({ ...signupInput, [type]: e.target.files?.[0] });
    };

    const loginSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, loginInput, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                dispatch(closeModal());
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const signupSubmitHandler = async (e) => {
        e.preventDefault();
        if (!signupInput.profilePhoto) {
            toast.error("Profile picture is required!");
            return;
        }

        const formData = new FormData();
        formData.append("fullname", signupInput.fullname);
        formData.append("email", signupInput.email);
        formData.append("phoneNumber", signupInput.phoneNumber);
        formData.append("password", signupInput.password);
        formData.append("role", signupInput.role);
        formData.append("profilePhoto", signupInput.profilePhoto);
        if (signupInput.resume) {
            formData.append("resume", signupInput.resume);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                setSignupEmail(signupInput.email);
                dispatch(setView("verify"));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const verifySubmitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/verify-otp`, { 
                email: signupEmail, 
                otp: otp 
            });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setView("login"));
                setOtp("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const resendOtpHandler = async () => {
        try {
            const res = await axios.post(`${USER_API_END_POINT}/resend-otp`, { email: signupEmail });
            if (res.data.success) {
                toast.success(res.data.message);
                setTimer(60);
            }
        } catch (error) {
            toast.error("Failed to resend OTP");
        }
    };

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none rounded-3xl shadow-2xl">
                <div className="flex flex-col h-full">
                    
                    {/* Tab Switcher - Hidden in Verify mode */}
                    {view !== "verify" && (
                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 m-6 rounded-2xl">
                            <button
                                onClick={() => dispatch(setView("login"))}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                                    view === "login" 
                                    ? "bg-white dark:bg-slate-700 text-primary shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                                }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => dispatch(setView("signup"))}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                                    view === "signup" 
                                    ? "bg-white dark:bg-slate-700 text-primary shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                                }`}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}

                    <div className="px-8 pb-8">
                        <AnimatePresence mode="wait">
                            {view === "login" && (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <form onSubmit={loginSubmitHandler} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    value={loginInput.email}
                                                    onChange={loginChangeHandler}
                                                    placeholder="name@example.com"
                                                    className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-xl"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label className="dark:text-slate-300">Password</Label>
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        dispatch(closeModal());
                                                        window.location.href = "/forgot-password";
                                                    }}
                                                    className="text-xs font-bold text-primary hover:underline"
                                                >
                                                    Forgot Password?
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={loginInput.password}
                                                    onChange={loginChangeHandler}
                                                    placeholder="••••••••"
                                                    className="pl-10 pr-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-xl"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Login As</Label>
                                            <div className="flex gap-4 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                                <button
                                                    type="button"
                                                    onClick={() => setLoginInput({...loginInput, role: 'student'})}
                                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${loginInput.role === 'student' ? 'bg-primary text-white' : 'text-slate-500'}`}
                                                >
                                                    Student
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setLoginInput({...loginInput, role: 'recruiter'})}
                                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${loginInput.role === 'recruiter' ? 'bg-primary text-white' : 'text-slate-500'}`}
                                                >
                                                    Recruiter
                                                </button>
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full rounded-xl py-6 font-bold text-md transition-all hover:scale-[1.02]" disabled={loading}>
                                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</> : "Sign In"}
                                        </Button>
                                    </form>
                                </motion.div>
                            )}

                            {view === "signup" && (
                                <motion.div
                                    key="signup"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <form onSubmit={signupSubmitHandler} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    type="text"
                                                    name="fullname"
                                                    value={signupInput.fullname}
                                                    onChange={signupChangeHandler}
                                                    placeholder="John Doe"
                                                    className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-xl"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    value={signupInput.email}
                                                    onChange={signupChangeHandler}
                                                    placeholder="name@example.com"
                                                    className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-xl"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    type="text"
                                                    name="phoneNumber"
                                                    value={signupInput.phoneNumber}
                                                    onChange={signupChangeHandler}
                                                    placeholder="1234567890"
                                                    className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-xl"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={signupInput.password}
                                                    onChange={signupChangeHandler}
                                                    placeholder="••••••••"
                                                    className="pl-10 pr-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-xl"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Role</Label>
                                            <div className="flex gap-4 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                                <button
                                                    type="button"
                                                    onClick={() => setSignupInput({...signupInput, role: 'student'})}
                                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${signupInput.role === 'student' ? 'bg-primary text-white' : 'text-slate-500'}`}
                                                >
                                                    Student
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSignupInput({...signupInput, role: 'recruiter'})}
                                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${signupInput.role === 'recruiter' ? 'bg-primary text-white' : 'text-slate-500'}`}
                                                >
                                                    Recruiter
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="dark:text-slate-300">Profile Photo</Label>
                                                <div className="relative">
                                                    <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => signupFileHandler(e, 'profilePhoto')}
                                                        className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-xl cursor-pointer text-xs"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="dark:text-slate-300">Resume (PDF, Optional)</Label>
                                                <div className="relative">
                                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        type="file"
                                                        accept="application/pdf"
                                                        onChange={(e) => signupFileHandler(e, 'resume')}
                                                        className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-xl cursor-pointer text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full rounded-xl py-6 font-bold text-md transition-all hover:scale-[1.02]" disabled={loading}>
                                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : "Create Account"}
                                        </Button>
                                    </form>
                                </motion.div>
                            )}

                            {view === "verify" && (
                                <motion.div
                                    key="verify"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="text-center py-4"
                                >
                                    <div className="mb-8">
                                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Mail className="h-10 w-10 text-primary" />
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Verify Email</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 px-6 leading-relaxed">
                                            We've sent a 6-digit code to <br/>
                                            <span className="font-bold text-slate-900 dark:text-white">{signupEmail}</span>
                                        </p>
                                    </div>

                                    <form onSubmit={verifySubmitHandler} className="space-y-8">
                                        <Input
                                            type="text"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                            placeholder="· · · · · ·"
                                            className="text-center text-3xl tracking-[1rem] h-20 font-black bg-slate-50 dark:bg-slate-800 border-none rounded-2xl"
                                            required
                                        />
                                        
                                        <div className="flex flex-col gap-4">
                                            <Button 
                                                type="submit" 
                                                className="w-full h-16 rounded-2xl font-black text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]" 
                                                disabled={loading || otp.length < 6}
                                            >
                                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verify Identity"}
                                            </Button>
                                            
                                            <button
                                                type="button"
                                                onClick={resendOtpHandler}
                                                disabled={timer > 0}
                                                className="text-sm font-bold text-primary disabled:text-slate-400 hover:underline transition-colors py-2"
                                            >
                                                {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive a code? Resend"}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
