import React, { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from './shared/Navbar'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Search, MapPin, Sparkles, Loader2, Filter, X, ArrowUpRight, Save, Database, Info } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setExternalJobs, updateExternalJob } from '@/redux/jobSlice'
import ExternalJobCard from './ExternalJobCard'
import { motion, AnimatePresence } from 'framer-motion'
import { clearExternalJobsCache, getCachedExternalJobs, saveExternalJobs } from '@/utils/db'
import { toast } from 'sonner'
import { openModal } from '@/redux/authModalSlice'

const GlobalJobSearch = () => {
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("India");
    const [loading, setLoading] = useState(false);
    const [matchingLoading, setMatchingLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [useCached, setUseCached] = useState(true);

    const { externalJobs = [] } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const observer = useRef();
    const lastJobElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Initial Load: Check Cache
    useEffect(() => {
        const loadCache = async () => {
            const cached = await getCachedExternalJobs();
            if (cached && cached.length > 0) {
                dispatch(setExternalJobs(cached));
                toast.info(`Loaded ${cached.length} jobs from backup storage.`);
            }
        };
        loadCache();
    }, [dispatch]);

    const performSearch = async (isNewSearch = false) => {
        if (!keyword.trim()) return;

        if (!user) {
            dispatch(openModal("signup"));
            toast.error("Please login to search the entire web.");
            return;
        }

        if (!user.isVerified) {
            dispatch(openModal("verify"));
            toast.error("Please verify your email to use global search.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/external/search`,
                { keyword, location, maxResults: 12 },
                { withCredentials: true }
            );

            if (res.data.success) {
                const newJobs = res.data.jobs;
                const updatedList = isNewSearch ? newJobs : [...externalJobs, ...newJobs];

                dispatch(setExternalJobs(updatedList));
                await saveExternalJobs(newJobs); // Cache new results

                if (newJobs.length < 12) setHasMore(false);
                if (isNewSearch) toast.success(`Found ${newJobs.length} new opportunities!`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Global search failed. Please verify your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleMatch = async () => {
        if (externalJobs.length === 0) return;
        if (!user) {
            dispatch(openModal("signup"));
            toast.error("Please login to match with your resume.");
            return;
        }

        if (!user.isVerified) {
            dispatch(openModal("verify"));
            toast.error("Please verify your email to use AI matching.");
            return;
        }

        try {
            setMatchingLoading(true);
            toast.info("Grok AI is analyzing matches based on your resume profile...");

            const res = await axios.post(`${JOB_API_END_POINT}/external/match`,
                { jobs: externalJobs },
                { withCredentials: true }
            );

            if (res.data.success) {
                dispatch(setExternalJobs(res.data.jobs));
                await saveExternalJobs(res.data.jobs); // Update cache with scores
                toast.success("AI Matching complete! Results ranked by relevance.");
            }
        } catch (error) {
            console.error(error);
            toast.error("AI Matching failed. Verify your profile settings.");
        } finally {
            setMatchingLoading(false);
        }
    };

    useEffect(() => {
        if (page > 1) performSearch(false);
    }, [page]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020817] transition-colors duration-300">
            <Navbar />
            <div className='max-w-7xl mx-auto pt-28 pb-20 px-4 md:px-8'>

                {/* Header Section */}
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12'>
                    <div>
                        <h1 className='text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2'>
                            Global <span className='text-primary'>Opportunities</span>
                        </h1>
                        <p className='text-slate-500 dark:text-slate-400 font-bold max-w-xl'>
                            Real-time intelligence fetching jobs from LinkedIn, Indeed, and thousands of other sources powered by AI.
                        </p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Button
                            variant="outline"
                            onClick={async () => { await clearExternalJobsCache(); dispatch(setExternalJobs([])); toast.info("Cache cleared."); }}
                            className="rounded-2xl gap-2 font-bold border-slate-200 dark:border-slate-800"
                        >
                            <Database size={16} />
                            Clear Storage
                        </Button>
                        <Button
                            disabled={externalJobs.length === 0 || matchingLoading}
                            onClick={handleMatch}
                            className="bg-primary hover:bg-primary/90 text-white rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                        >
                            {matchingLoading ? <Loader2 className='animate-spin' size={18} /> : <Sparkles size={18} />}
                            Rank with AI
                        </Button>
                    </div>
                </div>

                {/* Search Bar - Glassmorphism UI */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='w-full p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-2xl shadow-primary/5 flex flex-col md:flex-row items-center gap-2 mb-16'
                >
                    <div className='flex-1 flex items-center gap-3 px-6 py-4 w-full'>
                        <Search className='text-slate-400' size={20} />
                        <input
                            type="text"
                            placeholder="Role keyword (e.g. Frontend, Data Scientist...)"
                            className='w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white placeholder:text-slate-400'
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && performSearch(true)}
                        />
                    </div>
                    <div className='hidden md:block w-px h-8 bg-slate-100 dark:bg-slate-800' />
                    <div className='flex-1 flex items-center gap-3 px-6 py-4 w-full'>
                        <MapPin className='text-primary' size={20} />
                        <input
                            type="text"
                            placeholder="Location (e.g. London, Remote...)"
                            className='w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white placeholder:text-slate-400'
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <Button
                        disabled={loading}
                        onClick={() => performSearch(true)}
                        className="w-full md:w-auto px-10 py-7 rounded-[1.5rem] bg-slate-900 dark:bg-primary text-white font-black uppercase tracking-widest transition-all active:scale-95"
                    >
                        {loading ? <Loader2 className='animate-spin' /> : "Search Web"}
                    </Button>
                </motion.div>

                {/* Info Alert */}
                {externalJobs.length > 0 && (
                    <div className='flex items-center gap-3 px-6 py-4 bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl border border-blue-100/50 dark:border-blue-500/10 mb-8'>
                        <Info size={18} className="text-blue-500 shrink-0" />
                        <p className='text-xs font-bold text-blue-600 dark:text-blue-400'>
                            Data is currently stored in your browser's IndexedDB for offline access. Use "Rank with AI" to compare these results with your resume.
                        </p>
                    </div>
                )}

                {/* Results Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    <AnimatePresence mode='popLayout'>
                        {externalJobs.map((job, index) => (
                            <div key={job.url} ref={index === externalJobs.length - 1 ? lastJobElementRef : null}>
                                <ExternalJobCard job={job} />
                            </div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {externalJobs.length === 0 && !loading && (
                    <div className='flex flex-col items-center justify-center py-32 text-center opacity-60'>
                        <div className='h-24 w-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6'>
                            <Database className='text-slate-300' size={40} />
                        </div>
                        <h3 className='text-2xl font-black text-slate-900 dark:text-white'>No data in local storage</h3>
                        <p className='text-slate-500 font-bold mt-2'>Start a new search to fetch global opportunities.</p>
                    </div>
                )}

                {/* Bottom Loading Indicator */}
                {loading && page > 1 && (
                    <div className='flex justify-center mt-12'>
                        <Loader2 className='animate-spin text-primary' size={40} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default GlobalJobSearch
