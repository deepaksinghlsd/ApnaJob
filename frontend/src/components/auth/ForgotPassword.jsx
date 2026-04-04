import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020817] transition-colors duration-300">
            <Navbar />
            <div className='flex items-center justify-center min-h-[calc(100vh-64px)] px-4'>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800'
                >
                    <button 
                        onClick={() => navigate(-1)} 
                        className='flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-6'
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    
                    <h1 className='text-3xl font-bold text-slate-900 dark:text-white mb-2'>Forgot Password?</h1>
                    <p className='text-slate-500 dark:text-slate-400 mb-8'>No worries, we'll send you reset instructions.</p>

                    <form onSubmit={submitHandler} className='space-y-6'>
                        <div className='space-y-2'>
                            <Label className="dark:text-slate-300">Email Address</Label>
                            <div className='relative'>
                                <Mail className='absolute left-3 top-3 h-4 w-4 text-slate-400' />
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-xl py-6"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full rounded-xl py-6 font-bold text-md shadow-lg shadow-primary/20" disabled={loading}>
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Send Reset Link"}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
