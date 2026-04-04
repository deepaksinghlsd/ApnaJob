import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className="relative overflow-hidden pt-32 pb-20 px-4">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-6 items-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold mb-2 animate-bounce-slow">
                        <Sparkles className="h-4 w-4" />
                        <span>Discover Your Potential</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight dark:text-white leading-[1.1]">
                        The Smart Way to <br /> 
                        <span className="bg-gradient-to-r from-primary via-[#9b51e0] to-blue-500 bg-clip-text text-transparent">
                            Build Your Career
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium">
                        Leverage AI-powered matching to find roles that perfectly align with your skills and aspirations.
                    </p>

                    {/* Search Bar (Glassmorphism) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full max-w-2xl mt-10 p-2 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl flex items-center gap-2 group"
                    >
                        <div className="flex-1 flex items-center px-4 gap-3">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Job title, keywords, or company..."
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-transparent border-none outline-none py-3 text-lg font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                            />
                        </div>
                        <Button 
                            onClick={searchJobHandler} 
                            className="rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/30 active:scale-95 transition-all"
                        >
                            Find Jobs
                        </Button>
                    </motion.div>

                    {/* Quick Stats/Features */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-8 mt-16 text-slate-500 dark:text-slate-400 font-semibold text-sm"
                    >
                        <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
                            <TrendingUp className="h-5 w-5" />
                            <span>100k+ Active Jobs</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
                            <Users className="h-5 w-5" />
                            <span>50k+ Companies</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
                            <Sparkles className="h-5 w-5" />
                            <span>AI-Powered Matching</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
            </motion.div>
        </div>
    );
};

export default HeroSection;
