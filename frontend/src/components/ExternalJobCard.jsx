import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Briefcase, ExternalLink, Sparkles, CheckCircle2, MoreVertical } from 'lucide-react'
import { Badge } from './ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { toggleBookmark as toggleInDB, isBookmarked as checkInDB } from '@/utils/db'
import { toast } from 'sonner'

const ExternalJobCard = ({ job, onApply }) => {
    const [isSaved, setIsSaved] = useState(false);
    
    useEffect(() => {
        const checkBookmark = async () => {
            const saved = await checkInDB(job.url);
            setIsSaved(saved);
        };
        checkBookmark();
    }, [job.url]);

    const handleSave = async (e) => {
        e.stopPropagation();
        const saved = await toggleInDB(job);
        setIsSaved(saved);
        toast.success(saved ? "Job bookmarked locally!" : "Job removed from bookmarks.");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className='group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden'
        >
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800'>
                    <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                    <span className='text-[10px] font-bold text-primary uppercase tracking-wider'>External Result</span>
                </div>
                <Button 
                    onClick={handleSave}
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-full h-9 w-9 transition-all ${isSaved ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}
                >
                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                </Button>
            </div>

            <div className='flex items-start gap-4 mb-5'>
                <div className='flex-1 min-w-0'>
                    <h1 className='font-black text-xl leading-tight dark:text-white truncate group-hover:text-primary transition-colors'>
                        {job.title}
                    </h1>
                    <div className='flex flex-wrap items-center gap-2 mt-2'>
                        <span className='text-sm font-bold text-slate-600 dark:text-slate-400'>Web Source</span>
                        <div className='h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700' />
                        <div className='flex items-center gap-1.5 text-slate-400 font-medium'>
                            <MapPin className='h-3.5 w-3.5' />
                            <span className='text-xs'>Remote / Global</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mb-6'>
                <p className='text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium'>
                    {job.content || job.snippet || "A new opportunity discovered from the web. Click to view full details on the original platform."}
                </p>
            </div>

            <AnimatePresence>
                {job.matchScore !== undefined && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className='mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/10'
                    >
                        <div className='flex items-center justify-between mb-2'>
                            <div className='flex items-center gap-2'>
                                <div className='p-1 bg-primary text-white rounded-lg'>
                                    <Sparkles size={12} />
                                </div>
                                <span className='text-xs font-black uppercase tracking-widest text-primary'>Profile Match</span>
                            </div>
                            <span className='text-sm font-black text-primary'>{job.matchScore}%</span>
                        </div>
                        <p className='text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed line-clamp-2'>
                            {job.matchReasoning}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className='flex items-center gap-3 pt-4 border-t border-slate-50 dark:border-slate-800'>
                <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className='flex-1'
                >
                    <Button 
                        className="w-full rounded-2xl h-12 bg-primary hover:bg-primary/90 text-white font-black transition-all active:scale-95 text-xs shadow-lg shadow-primary/20 group/btn"
                    >
                        Apply on Platform
                        <ExternalLink className="ml-2 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Button>
                </a>
            </div>
        </motion.div>
    );
};

export default ExternalJobCard;
