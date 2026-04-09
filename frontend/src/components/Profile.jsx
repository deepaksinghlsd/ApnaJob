import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, FileText, Briefcase, GraduationCap, LayoutDashboard, PlusCircle, Sparkles, CheckCircle2, XCircle } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import AppliedJobTable from './AppliedJobTable'
import AdminJobsTable from './admin/AdminJobsTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Profile = () => {
    const { user } = useSelector(store => store.auth);

    // Conditional hook calls based on role
    if (user?.role === 'student') {
        useGetAppliedJobs();
    } else if (user?.role === 'recruiter') {
        useGetAllAdminJobs();
    }

    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const handleAutoApplyToggle = async () => {
        try {
            const res = await axios.post(`${USER_API_END_POINT}/toggle-auto-apply`, {}, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser({ ...user, autoApplyEnabled: res.data.autoApplyEnabled }));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error("Failed to update auto-apply setting");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020817] transition-colors duration-300">
            <Navbar />
            <div className='max-w-7xl mx-auto pt-24 pb-12 px-4 md:px-8'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>

                    {/* Left Column - User Info Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='lg:col-span-4 space-y-6'
                    >
                        <div className='bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm'>
                            <div className='flex flex-col items-center text-center'>
                                <div className='relative group mb-6'>
                                    <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden ring-4 ring-primary/5">
                                        <AvatarImage src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} className="object-cover" />
                                    </Avatar>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setOpen(true)}
                                        className="absolute bottom-1 right-1 p-2.5 bg-primary text-white rounded-full shadow-lg border-4 border-white dark:border-slate-900 hover:bg-primary/90 transition-colors"
                                    >
                                        <Pen size={14} />
                                    </motion.button>
                                </div>
                                <h1 className='text-2xl font-black text-slate-900 dark:text-white tracking-tight'>{user?.fullname}</h1>
                                <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-none text-[10px] uppercase tracking-widest font-black px-3">
                                    {user?.role}
                                </Badge>
                                <p className='text-slate-500 dark:text-slate-400 font-medium mt-4 text-sm leading-relaxed'>
                                    {user?.profile?.bio || "No profile bio added yet. Update your profile to stand out!"}
                                </p>
                            </div>

                            <div className='mt-8 space-y-4 pt-8 border-t border-slate-50 dark:border-slate-800'>
                                <div className='flex items-center gap-3 text-sm'>
                                    <div className='p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-primary'>
                                        <Mail size={16} />
                                    </div>
                                    <div className='overflow-hidden'>
                                        <p className='text-[10px] uppercase tracking-wider text-slate-400 font-black'>Email Address</p>
                                        <p className='text-slate-700 dark:text-slate-200 font-bold truncate'>{user?.email}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3 text-sm'>
                                    <div className='p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-primary'>
                                        <Contact size={16} />
                                    </div>
                                    <div className='overflow-hidden'>
                                        <p className='text-[10px] uppercase tracking-wider text-slate-400 font-black'>Phone Number</p>
                                        <p className='text-slate-700 dark:text-slate-200 font-bold truncate'>{user?.phoneNumber || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {user?.role === 'student' && (
                                <div className='mt-8 pt-8 border-t border-slate-50 dark:border-slate-800'>
                                    <div className='flex items-center gap-2 mb-4'>
                                        <GraduationCap size={18} className="text-primary" />
                                        <h2 className='text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider'>Professional Skills</h2>
                                    </div>
                                    <div className='flex flex-wrap gap-2'>
                                        {user?.profile?.skills?.length > 0 ? (
                                            user.profile.skills.map((item, index) => (
                                                <Badge key={index} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary border-none px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-default">
                                                    {item}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-slate-400 italic text-xs">No skills listed</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {user?.role === 'student' && user?.profile?.resume && (
                            <div className='bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm'>
                                <div className='flex items-center gap-2 mb-4'>
                                    <FileText size={18} className="text-primary" />
                                    <h2 className='text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider'>Resume / CV</h2>
                                </div>
                                <a
                                    target='_blank'
                                    rel="noopener noreferrer"
                                    href={user?.profile?.resume}
                                    className='flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all group'
                                >
                                    <span className='text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]'>
                                        {user?.profile?.resumeOriginalName}
                                    </span>
                                    <span className='text-[10px] font-black text-primary group-hover:underline uppercase tracking-widest'>View</span>
                                </a>
                            </div>
                        )}
                    </motion.div>

                    {/* Right Column - Dashboard Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='lg:col-span-8 space-y-6'
                    >
                        <div className='bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm min-h-[600px]'>
                            <div className='flex items-center justify-between mb-8'>
                                <div className='flex items-center gap-3'>
                                    <div className='p-3 bg-primary/10 rounded-2xl text-primary'>
                                        <LayoutDashboard size={24} />
                                    </div>
                                    <div>
                                        <h2 className='text-2xl font-black text-slate-900 dark:text-white tracking-tight'>
                                            {user?.role === 'student' ? "Application History" : "Post Management"}
                                        </h2>
                                        <p className='text-xs text-slate-500 font-bold'>
                                            {user?.role === 'student' ? "Track your journey across different companies" : "Control and monitor your job listings"}
                                        </p>
                                    </div>
                                </div>

                                {user?.role === 'recruiter' && (
                                    <Link to="/admin/jobs/create">
                                        <Button className="rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                                            <PlusCircle size={18} />
                                            Post New Job
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            {/* AI Summary Section */}
                            {user?.profile?.summary && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className='mb-8 p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group'
                                >
                                    <div className='absolute -right-4 -top-4 text-primary/5 group-hover:text-primary/10 transition-colors'>
                                        <Sparkles size={120} />
                                    </div>
                                    <div className='relative z-10'>
                                        <div className='flex items-center gap-2 mb-3'>
                                            <Sparkles size={16} className="text-primary" />
                                            <h3 className='text-[10px] font-black uppercase tracking-[0.2em] text-primary'>AI-Generated Professional Summary</h3>
                                        </div>
                                        <p className='text-sm text-slate-700 dark:text-slate-200 font-bold leading-relaxed italic'>
                                            "{user?.profile?.summary}"
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            <div className='mt-8 pt-8 border-t border-slate-50 dark:border-slate-800'>
                                {user?.role === 'student' ? (
                                    <AppliedJobTable />
                                ) : (
                                    <AdminJobsTable />
                                )}
                            </div>
                            {user?.role === 'student' && (
                                <div className='bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm mt-6'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <div className='p-2 bg-primary/10 rounded-lg text-primary'>
                                                <Sparkles size={16} />
                                            </div>
                                            <div>
                                                <h2 className='text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider'>Auto-Apply AI</h2>
                                                <p className='text-[10px] text-slate-500 font-bold'>Let AI match & apply for you</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={user?.autoApplyEnabled}
                                            onCheckedChange={handleAutoApplyToggle}
                                            className="data-[state=checked]:bg-primary"
                                        />
                                    </div>
                                    <div className='mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800'>
                                        {user?.autoApplyEnabled ? (
                                            <>
                                                <CheckCircle2 size={12} className="text-green-500" />
                                                <span className='text-[10px] font-bold text-slate-600 dark:text-slate-400'>Currently active for backend matching</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle size={12} className="text-slate-400" />
                                                <span className='text-[10px] font-bold text-slate-400'>Inactive. Enabling targets matches &gt;80%</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Resume Viewer */}
                            {user?.role === 'student' && user?.profile?.resume && (
                                <div className='mt-12 pt-12 border-t border-slate-50 dark:border-slate-800'>
                                    <div className='flex items-center justify-between mb-6'>
                                        <div className='flex items-center gap-3'>
                                            <div className='p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl'>
                                                <FileText size={24} className="text-primary" />
                                            </div>
                                            <div>
                                                <h2 className='text-xl font-black text-slate-900 dark:text-white tracking-tight'>Resume Preview</h2>
                                                <p className='text-xs text-slate-500 font-bold'>Review your uploaded professional document</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="rounded-xl font-bold"
                                            onClick={() => window.open(user?.profile?.resume, '_blank')}
                                        >
                                            Open in New Tab
                                        </Button>
                                    </div>
                                    <div className='w-full h-[600px] bg-slate-100 dark:bg-slate-800/50 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800'>
                                        <iframe
                                            src={`https://docs.google.com/gview?url=${encodeURIComponent(user?.profile?.resume)}&embedded=true`}
                                            className='w-full h-full border-none'
                                            title="Resume Preview"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile