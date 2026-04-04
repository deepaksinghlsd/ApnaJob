import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { 
    MapPin, 
    Briefcase, 
    IndianRupee, 
    Calendar,
    Users,
    Building2,
    Share2,
    Bookmark,
    ArrowLeft,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { openModal } from '@/redux/authModalSlice';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const jobId = params.id;
    
    const isIntiallyApplied = singleJob?.applications?.some(
        application => application.applicant === user?._id
    ) || false;
    
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);

    const applyJobHandler = async () => {
        if (!user) {
            dispatch(openModal('login'));
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = {
                    ...singleJob,
                    applications: [...singleJob.applications, { applicant: user?._id }]
                };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get/${jobId}`,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    if (user) {
                        setIsApplied(
                            res.data.job.applications?.some(
                                application => application.applicant === user?._id
                            ) || false
                        );
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    const formatSalary = (salary) => {
        if (!salary) return 'Not disclosed';
        return `₹${salary} LPA`;
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className='min-h-screen bg-slate-50 dark:bg-[#020817] transition-colors duration-300'>
            <Navbar />
            
            <div className='max-w-7xl mx-auto px-4 md:px-8 py-24'>
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className='flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-bold text-sm'
                >
                    <ArrowLeft className='w-4 h-4' />
                    <span>Back to Opportunities</span>
                </motion.button>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                    {/* Left Column - Core Info */}
                    <div className='lg:col-span-8 space-y-6'>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm'
                        >
                            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                                <div className='flex items-center gap-5'>
                                    <div className='w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center p-3 shadow-inner'>
                                        {singleJob?.company?.logo ? (
                                            <img src={singleJob.company.logo} alt="" className='w-full h-full object-contain' />
                                        ) : (
                                            <Building2 className='w-10 h-10 text-slate-300' />
                                        )}
                                    </div>
                                    <div>
                                        <h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight'>
                                            {singleJob?.title}
                                        </h1>
                                        <div className='flex items-center gap-3 mt-2 text-slate-500 dark:text-slate-400 font-bold'>
                                            <span className='hover:text-primary cursor-pointer transition-colors'>
                                                {singleJob?.company?.name}
                                            </span>
                                            <span className='w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700' />
                                            <div className='flex items-center gap-1.5'>
                                                <MapPin size={14} className="text-secondary-foreground/40" />
                                                <span>{singleJob?.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <button 
                                        onClick={() => setIsBookmarked(!isBookmarked)}
                                        className={`p-3 rounded-2xl border transition-all ${isBookmarked ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-primary/30'}`}
                                    >
                                        <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                                    </button>
                                    <button className='p-3 rounded-2xl border bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-primary/30 transition-all'>
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-10'>
                                <div className='bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-700/50'>
                                    <span className='text-[10px] uppercase tracking-widest text-slate-400 font-black block mb-1'>Salary</span>
                                    <div className='flex items-center gap-2 text-slate-900 dark:text-white font-bold'>
                                        <IndianRupee size={16} className="text-primary" />
                                        {formatSalary(singleJob?.salary)}
                                    </div>
                                </div>
                                <div className='bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-700/50'>
                                    <span className='text-[10px] uppercase tracking-widest text-slate-400 font-black block mb-1'>Experience</span>
                                    <div className='flex items-center gap-2 text-slate-900 dark:text-white font-bold'>
                                        <Briefcase size={16} className="text-primary" />
                                        {singleJob?.experienceLevel} Years
                                    </div>
                                </div>
                                <div className='bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-700/50'>
                                    <span className='text-[10px] uppercase tracking-widest text-slate-400 font-black block mb-1'>Type</span>
                                    <div className='flex items-center gap-2 text-slate-900 dark:text-white font-bold'>
                                        <Clock size={16} className="text-primary" />
                                        {singleJob?.jobType}
                                    </div>
                                </div>
                                <div className='bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-700/50'>
                                    <span className='text-[10px] uppercase tracking-widest text-slate-400 font-black block mb-1'>Applicants</span>
                                    <div className='flex items-center gap-2 text-slate-900 dark:text-white font-bold'>
                                        <Users size={16} className="text-primary" />
                                        {singleJob?.applications?.length || 0}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className='bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm'
                        >
                            <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2'>
                                <div className='w-1.5 h-6 bg-primary rounded-full' />
                                Job Overview
                            </h3>
                            <div className='prose dark:prose-invert max-w-none'>
                                <p className='text-slate-600 dark:text-slate-400 leading-relaxed font-medium whitespace-pre-line'>
                                    {singleJob?.description}
                                </p>
                            </div>

                            {singleJob?.requirements?.length > 0 && (
                                <div className='mt-10'>
                                    <h4 className='text-lg font-bold text-slate-900 dark:text-white mb-4'>Key Responsibilities</h4>
                                    <ul className='space-y-3'>
                                        {singleJob.requirements.map((req, i) => (
                                            <li key={i} className='flex items-start gap-3 text-slate-600 dark:text-slate-400 font-medium'>
                                                <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {singleJob?.skills?.length > 0 && (
                                <div className='mt-10'>
                                    <h4 className='text-lg font-bold text-slate-900 dark:text-white mb-4'>Tech Stack & Skills</h4>
                                    <div className='flex flex-wrap gap-2'>
                                        {singleJob.skills.map((skill, i) => (
                                            <Badge key={i} className="bg-primary/10 text-primary border-none px-4 py-2 rounded-xl text-sm font-bold">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Column - Apply Card */}
                    <div className='lg:col-span-4'>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className='sticky top-24 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none'
                        >
                            <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>Interested?</h3>
                            <p className='text-sm text-slate-500 mb-8 font-medium'>Ensure your profile is complete before applying.</p>
                            
                            <Button 
                                onClick={applyJobHandler}
                                disabled={isApplied || loading}
                                className={`w-full py-8 rounded-2xl font-black text-lg transition-all ${isApplied ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20' : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:scale-[1.02]'}`}
                            >
                                {loading ? (
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                ) : isApplied ? (
                                    <span className='flex items-center gap-2'><CheckCircle2 /> Applied</span>
                                ) : (
                                    'Apply Now'
                                )}
                            </Button>

                            <div className='mt-8 pt-8 border-t border-slate-100 dark:border-slate-800'>
                                <div className='flex items-center justify-between text-sm mb-4'>
                                    <span className='text-slate-500 font-bold'>Posted date</span>
                                    <span className='text-slate-900 dark:text-slate-200 font-black'>{formatDate(singleJob?.createdAt)}</span>
                                </div>
                                <div className='flex items-center justify-between text-sm mb-4'>
                                    <span className='text-slate-500 font-bold'>Location</span>
                                    <span className='text-slate-900 dark:text-slate-200 font-black'>{singleJob?.location}</span>
                                </div>
                                <div className='flex items-center justify-between text-sm'>
                                    <span className='text-slate-500 font-bold'>Job Type</span>
                                    <span className='text-slate-900 dark:text-slate-200 font-black'>{singleJob?.jobType}</span>
                                </div>
                            </div>

                            <div className='mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700'>
                                <p className='text-[11px] text-slate-500 dark:text-slate-400 text-center font-bold leading-relaxed uppercase tracking-wider'>
                                    By applying, you agree to our terms of service and privacy policy.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JobDescription;