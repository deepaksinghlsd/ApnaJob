import React from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Briefcase, DollarSign, Clock, ArrowUpRight } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
        return days === 0 ? "Today" : `${days}d ago`;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className='group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden'
        >
            {/* Background Glow */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors pointer-events-none" />

            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800'>
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span className='text-[10px] font-bold text-slate-500 uppercase tracking-wider'>
                        {daysAgoFunction(job?.createdAt)}
                    </span>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                >
                    <Bookmark className="h-4 w-4" />
                </Button>
            </div>

            <div className='flex items-start gap-4 mb-5'>
                <div className='p-3 h-14 w-14 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:border-primary/30 transition-colors shrink-0 overflow-hidden'>
                    <Avatar className="h-full w-full rounded-lg">
                        <AvatarImage src={job?.company?.logo} className="object-contain" />
                    </Avatar>
                </div>
                <div className='overflow-hidden pt-1'>
                    <h1 className='font-bold text-lg leading-tight dark:text-white truncate group-hover:text-primary transition-colors'>
                        {job?.title}
                    </h1>
                    <div className='flex items-center gap-2 mt-1'>
                        <span className='text-sm font-semibold text-slate-600 dark:text-slate-400'>{job?.company?.name}</span>
                        <div className='h-1 w-1 rounded-full bg-slate-300' />
                        <div className='flex items-center gap-1 text-slate-400'>
                            <MapPin className='h-3 w-3' />
                            <span className='text-xs font-medium'>India</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mb-6'>
                <p className='text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed'>
                    {job?.description}
                </p>
            </div>

            <div className='flex flex-wrap items-center gap-2 mb-6'>
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wide">
                    {job?.position} Positions
                </Badge>
                <Badge variant="secondary" className="bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wide">
                    {job?.jobType}
                </Badge>
                <Badge variant="secondary" className="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wide">
                    {job?.salary}LPA
                </Badge>
            </div>

            <div className='flex items-center gap-3 pt-4 border-t border-slate-50 dark:border-slate-800'>
                <Button 
                    onClick={() => navigate(`/description/${job?._id}`)} 
                    variant="outline" 
                    className="flex-1 rounded-xl h-11 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all text-xs"
                >
                    View Details
                </Button>
                <Button 
                    className="flex-1 rounded-xl h-11 bg-primary hover:bg-primary/90 text-white font-bold transition-all active:scale-95 text-xs shadow-lg shadow-primary/20"
                >
                    Apply Now
                    <ArrowUpRight className="ml-2 h-3 w-3" />
                </Button>
            </div>
        </motion.div>
    )
}

export default Job