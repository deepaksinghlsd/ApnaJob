import React from 'react';
import { Button } from './ui/button';
import { Search, Sparkles, Globe, Zap, ArrowRight, TrendingUp, ShieldCheck, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GlobalSearchCTA = () => {
    const navigate = useNavigate();

    return (
        <div className="py-24 px-4 bg-white dark:bg-[#020817] transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative overflow-hidden rounded-[3.5rem] bg-slate-900 border border-slate-800 p-8 md:p-20 shadow-2xl"
                >
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary/10 via-primary/5 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10 text-center lg:text-left">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-widest animate-pulse">
                                <Globe size={14} />
                                <span>Global Career Intelligence Unlocked</span>
                            </div>
                            
                            <h2 className="text-4xl md:text-7xl font-black text-white leading-[1.05] tracking-tight">
                                Find the <span className="text-primary italic">Hidden Gems</span> in Your Industry.
                            </h2>
                            
                            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Our intelligent discovery engine scans millions of listings across the web to bring you exclusive opportunities tailored to your career trajectory.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start pt-4">
                                <Button 
                                    onClick={() => navigate('/global-search')}
                                    className="px-12 py-9 rounded-3xl bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-2xl shadow-primary/30 group transition-all hover:scale-[1.03] active:scale-95"
                                >
                                    Explore Global Jobs
                                    <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1.5" />
                                </Button>
                                <div className="flex items-center gap-2 px-8 py-5 rounded-3xl border border-slate-800 bg-white/5 backdrop-blur-md text-slate-300 font-bold text-sm">
                                    <Sparkles size={18} className="text-primary" />
                                    Personalized Ranking
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <BenefitCard 
                                icon={<Target className="text-blue-400" />}
                                title="Limitless Reach"
                                desc="Gain priority access to internal and external listings worldwide."
                                color="blue"
                            />
                            <BenefitCard 
                                icon={<Zap className="text-yellow-400" />}
                                title="Real-time Discovery"
                                desc="Be the first to apply with instant notifications for new roles."
                                color="yellow"
                            />
                            <BenefitCard 
                                icon={<TrendingUp className="text-green-400" />}
                                title="Career Precision"
                                desc="Our matching engine aligns roles with your unique potential."
                                color="green"
                            />
                            <BenefitCard 
                                icon={<ShieldCheck className="text-purple-400" />}
                                title="Verified Leads"
                                desc="Ensure every opportunity is safe and vetted for your growth."
                                color="purple"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const BenefitCard = ({ icon, title, desc, color }) => (
    <div className={`group p-8 rounded-[2.5rem] bg-white/5 border border-slate-800 hover:border-${color}-500/30 transition-all duration-500 hover:bg-${color}-500/5`}>
        <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
            {icon}
        </div>
        <h4 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h4>
        <p className="text-slate-500 text-sm font-medium leading-relaxed group-hover:text-slate-400 transition-colors">{desc}</p>
    </div>
);

export default GlobalSearchCTA;
