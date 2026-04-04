import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import GlobalSearchCTA from './GlobalSearchCTA'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, TrendingUp, Users, ShieldCheck, Zap } from 'lucide-react'

const Home = () => {
    useGetAllJobs();
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'recruiter') {
            navigate("/admin/companies");
        }
    }, [user, navigate]);

    return (
        <div className="w-full min-h-screen overflow-x-hidden bg-white dark:bg-[#020817] transition-colors duration-500">
            <Navbar />
            
            <main>
                {/* Hero with better transitions */}
                <HeroSection />

                <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-32 pb-40">
                    
                    {/* Trust/Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center py-20 border-y border-slate-50 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-900/10 rounded-[3rem]">
                        <StatItem icon={<Users className="text-blue-500" />} count="50k+" label="Global Users" />
                        <StatItem icon={<CheckCircle2 className="text-emerald-500" />} count="20k+" label="Placements" />
                        <StatItem icon={<TrendingUp className="text-amber-500" />} count="100k+" label="Job Opportunities" />
                        <StatItem icon={<ShieldCheck className="text-primary" />} count="5k+" label="Verified Org" />
                    </div>

                    {/* Features/Discovery */}
                    <CategoryCarousel />

                    {/* Benefit-led CTA section */}
                    <GlobalSearchCTA />

                    {/* Value Prop Section */}
                    <div className="relative py-24 rounded-[4rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-primary/5">
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full" />
                        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight px-4">
                                Why verified professionals <span className="text-primary underline decoration-primary/20">choose our platform</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-8">
                                <FeatureItem 
                                    icon={<Zap className="text-amber-500" />} 
                                    title="Instant Matching" 
                                    desc="Our AI matches you within seconds after you complete your profile." 
                                />
                                <FeatureItem 
                                    icon={<Users className="text-blue-500" />} 
                                    title="Verified Recruiters" 
                                    desc="Connect directly with pre-vetted companies and industry leaders." 
                                />
                                <FeatureItem 
                                    icon={<ShieldCheck className="text-emerald-500" />} 
                                    title="Privacy First" 
                                    desc="Your data is encrypted and only shared with your chosen employers." 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Latest Jobs with a fresh look */}
                    <LatestJobs />
                </div>
            </main>

            <Footer />
        </div>
    )
}

const StatItem = ({ icon, count, label }) => (
    <div className="text-center group">
        <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h4 className="text-2xl font-black text-slate-900 dark:text-white">{count}</h4>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
);

const FeatureItem = ({ icon, title, desc }) => (
    <div className="space-y-4">
        <div className="h-14 w-14 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto border border-slate-200 dark:border-slate-700">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
    </div>
);

export default Home
