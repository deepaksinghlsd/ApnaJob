import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
    Contact, Mail, Pen, FileText, Briefcase, GraduationCap,
    LayoutDashboard, PlusCircle, Sparkles, CheckCircle2,
    XCircle, Settings, History, Eye
} from 'lucide-react'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const Profile = () => {
    // FIX: Hooks must be called at the top level
    useGetAppliedJobs();
    useGetAllAdminJobs();

    const { user } = useSelector(store => store.auth);
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
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020817] transition-colors duration-300">
            <Navbar />

            <main className='max-w-7xl mx-auto pt-28 pb-12 px-4 md:px-8'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>

                    {/* Left Sidebar: Profile Card */}
                    <motion.aside
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='lg:col-span-4 space-y-6'
                    >
                        <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none sticky top-28'>
                            <div className='flex flex-col items-center'>
                                <div className='relative group'>
                                    <Avatar className="h-36 w-36 border-[6px] border-slate-50 dark:border-slate-800 shadow-xl ring-1 ring-primary/10">
                                        <AvatarImage src={user?.profile?.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} className="object-cover" />
                                    </Avatar>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setOpen(true)}
                                        className="absolute bottom-2 right-2 p-2.5 bg-primary text-white rounded-2xl shadow-lg hover:rotate-12 transition-all"
                                    >
                                        <Pen size={16} />
                                    </motion.button>
                                </div>

                                <h1 className='mt-6 text-2xl font-black text-slate-900 dark:text-white'>{user?.fullname}</h1>
                                <Badge className="mt-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-none font-bold uppercase tracking-tighter">
                                    {user?.role}
                                </Badge>

                                <p className='mt-4 text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed px-2 font-medium'>
                                    {user?.profile?.bio || "Crafting a digital presence..."}
                                </p>
                            </div>

                            <div className='mt-10 space-y-5'>
                                <div className='group flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'>
                                    <div className='p-2.5 bg-primary/5 text-primary rounded-xl'> <Mail size={18} /> </div>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] uppercase font-black text-slate-400 tracking-widest'>Email</span>
                                        <span className='text-sm font-bold text-slate-700 dark:text-slate-200 truncate'>{user?.email}</span>
                                    </div>
                                </div>
                                <div className='group flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'>
                                    <div className='p-2.5 bg-primary/5 text-primary rounded-xl'> <Contact size={18} /> </div>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] uppercase font-black text-slate-400 tracking-widest'>Phone</span>
                                        <span className='text-sm font-bold text-slate-700 dark:text-slate-200'>{user?.phoneNumber || "Not provided"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-10'>
                                <div className='flex items-center gap-2 mb-4'>
                                    <Sparkles size={16} className="text-primary" />
                                    <h2 className='text-xs font-black uppercase tracking-widest text-slate-400'>Skills Matrix</h2>
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {user?.profile?.skills?.map((skill, i) => (
                                        <Badge key={i} variant="outline" className="rounded-lg py-1 px-3 border-slate-200 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-300 font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.aside>

                    {/* Right Content: Dynamic Workspace */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='lg:col-span-8 space-y-6'
                    >
                        <Tabs defaultValue="activity" className="w-full">
                            <div className='flex items-center justify-between mb-6 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800'>
                                <TabsList className="bg-transparent gap-2">
                                    <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl px-6 font-bold flex gap-2">
                                        <History size={16} /> Activity
                                    </TabsTrigger>
                                    {user?.role === 'student' && (
                                        <TabsTrigger value="resume" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl px-6 font-bold flex gap-2">
                                            <FileText size={16} /> Documents
                                        </TabsTrigger>
                                    )}
                                    <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl px-6 font-bold flex gap-2">
                                        <Settings size={16} /> Preferences
                                    </TabsTrigger>
                                </TabsList>

                                {user?.role === 'recruiter' && (
                                    <Link to="/admin/jobs/create">
                                        <Button className="rounded-xl gap-2 font-bold px-6 mr-2">
                                            <PlusCircle size={18} /> Post Job
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            <TabsContent value="activity" className="mt-0 space-y-6">
                                {/* AI Summary Highlight */}
                                {user?.profile?.summary && (
                                    <div className='relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 p-8 rounded-[2rem] text-white'>
                                        <Sparkles className="absolute top-[-20px] right-[-20px] h-40 w-40 opacity-10 rotate-12" />
                                        <div className='relative z-10'>
                                            <div className='flex items-center gap-2 mb-3'>
                                                <Badge className="bg-white/20 hover:bg-white/30 border-none text-[10px] font-black uppercase">AI Insight</Badge>
                                            </div>
                                            <p className='text-lg font-bold italic leading-relaxed'>"{user?.profile?.summary}"</p>
                                        </div>
                                    </div>
                                )}

                                <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8'>
                                    <h2 className='text-xl font-black text-slate-900 dark:text-white mb-6'>
                                        {user?.role === 'student' ? "Applied Vacancies" : "Active Listings"}
                                    </h2>
                                    {user?.role === 'student' ? <AppliedJobTable /> : <AdminJobsTable />}
                                </div>
                            </TabsContent>

                            <TabsContent value="resume">
                                <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8'>
                                    <div className='flex items-center justify-between mb-8'>
                                        <div>
                                            <h2 className='text-xl font-black text-slate-900 dark:text-white'>Resume Preview</h2>
                                            <p className='text-xs text-slate-500 font-bold'>Verified: {user?.profile?.resumeOriginalName}</p>
                                        </div>
                                        {/* <Button variant="outline" className="rounded-xl font-bold" asChild>
                                            <a href={user?.profile?.resume} download={user?.profile?.resumeOriginalName}>Download PDF</a>
                                        </Button> */}
                                    </div>
                                    <div className='w-full h-[700px] bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800'>
                                        <iframe
                                            src={`https://docs.google.com/gview?url=${encodeURIComponent(user?.profile?.resume)}&embedded=true`}
                                            className='w-full h-full'
                                            title="Resume"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="settings">
                                <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8'>
                                    <h2 className='text-xl font-black text-slate-900 dark:text-white mb-6'>Smart Settings</h2>

                                    {user?.role === 'student' && (
                                        <div className='flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800'>
                                            <div className='flex items-start gap-4 mb-4 md:mb-0'>
                                                <div className='p-3 bg-primary/10 text-primary rounded-2xl'> <Sparkles /> </div>
                                                <div>
                                                    <h3 className='font-black text-slate-900 dark:text-white'>Auto-Apply AI Matcher</h3>
                                                    <p className='text-xs text-slate-500 font-bold'>Automatically apply to jobs with {'>'}80% skill match.</p>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-3'>
                                                <span className={`text-[10px] font-black uppercase ${user?.autoApplyEnabled ? 'text-green-500' : 'text-slate-400'}`}>
                                                    {user?.autoApplyEnabled ? 'Enabled' : 'Disabled'}
                                                </span>
                                                <Switch
                                                    checked={user?.autoApplyEnabled}
                                                    onCheckedChange={handleAutoApplyToggle}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {/* Additional settings can go here */}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </div>
            </main>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile;