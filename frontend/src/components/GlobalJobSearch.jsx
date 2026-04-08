import React, { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from './shared/Navbar'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Search, MapPin, Sparkles, Loader2, Filter, X, ArrowUpRight, Save, Database, Info, Globe, ChevronDown, Plus, Building2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setExternalJobs, updateExternalJob } from '@/redux/jobSlice'
import ExternalJobCard from './ExternalJobCard'
import { motion, AnimatePresence } from 'framer-motion'
import { clearExternalJobsCache, getCachedExternalJobs, saveExternalJobs } from '@/utils/db'
import { toast } from 'sonner'
import { openModal } from '@/redux/authModalSlice'
import countryCitiesData from '@/data/countryCities.json'

const GlobalJobSearch = () => {
    const [keyword, setKeyword] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("India");
    const [selectedCity, setSelectedCity] = useState("");
    const [customCity, setCustomCity] = useState("");
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [matchingLoading, setMatchingLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const { externalJobs = [] } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const countryDropdownRef = useRef(null);
    const cityDropdownRef = useRef(null);

    const countries = Object.keys(countryCitiesData);
    const cities = countryCitiesData[selectedCountry] || [];

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
                setShowCountryDropdown(false);
            }
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
                setShowCityDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Build final location string
    const getLocationQuery = () => {
        if (showCustomInput && customCity.trim()) {
            return `${customCity.trim()}, ${selectedCountry}`;
        }
        if (selectedCity) {
            return `${selectedCity}, ${selectedCountry}`;
        }
        return selectedCountry;
    };

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

        try {
            setLoading(true);
            const locationQuery = getLocationQuery();
            const res = await axios.post(`${JOB_API_END_POINT}/external/search`,
                { keyword, location: locationQuery, maxResults: 12 },
                { withCredentials: true }
            );

            if (res.data.success) {
                const newJobs = res.data.jobs;
                const updatedList = isNewSearch ? newJobs : [...externalJobs, ...newJobs];

                dispatch(setExternalJobs(updatedList));
                await saveExternalJobs(newJobs);

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

        try {
            setMatchingLoading(true);
            toast.info("Grok AI is analyzing matches based on your resume profile...");

            const res = await axios.post(`${JOB_API_END_POINT}/external/match`,
                { jobs: externalJobs },
                { withCredentials: true }
            );

            if (res.data.success) {
                dispatch(setExternalJobs(res.data.jobs));
                await saveExternalJobs(res.data.jobs);
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

                {/* Country & City Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className='w-full p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-lg mb-4'
                >
                    <div className='flex items-center gap-2 mb-3'>
                        <Globe className='text-primary' size={16} />
                        <span className='text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>Location Preferences</span>
                    </div>
                    <div className='flex flex-col md:flex-row items-stretch gap-3'>
                        {/* Country Selector */}
                        <div className='relative flex-1' ref={countryDropdownRef}>
                            <button
                                onClick={() => { setShowCountryDropdown(!showCountryDropdown); setShowCityDropdown(false); }}
                                className='w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-primary/50 transition-colors'
                            >
                                <div className='flex items-center gap-2'>
                                    <Globe className='text-slate-400' size={16} />
                                    <span className='font-bold text-sm text-slate-800 dark:text-white'>{selectedCountry}</span>
                                </div>
                                <ChevronDown className={`text-slate-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} size={16} />
                            </button>
                            <AnimatePresence>
                                {showCountryDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -5, scale: 0.98 }}
                                        transition={{ duration: 0.15 }}
                                        className='absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto custom-scrollbar'
                                    >
                                        {countries.map((country) => (
                                            <button
                                                key={country}
                                                onClick={() => {
                                                    setSelectedCountry(country);
                                                    setSelectedCity("");
                                                    setShowCustomInput(false);
                                                    setCustomCity("");
                                                    setShowCountryDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5 dark:hover:bg-primary/10 ${
                                                    selectedCountry === country
                                                        ? 'text-primary bg-primary/5 dark:bg-primary/10 font-bold'
                                                        : 'text-slate-600 dark:text-slate-300'
                                                }`}
                                            >
                                                {country}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* City Selector */}
                        <div className='relative flex-1' ref={cityDropdownRef}>
                            {showCustomInput ? (
                                <div className='flex items-center gap-2'>
                                    <div className='relative flex-1'>
                                        <Building2 className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
                                        <input
                                            type='text'
                                            placeholder='Type your city name...'
                                            value={customCity}
                                            onChange={(e) => setCustomCity(e.target.value)}
                                            className='w-full pl-10 pr-4 py-3 rounded-xl border border-primary/30 dark:border-primary/50 bg-slate-50 dark:bg-slate-800/50 text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 transition-all'
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        onClick={() => { setShowCustomInput(false); setCustomCity(""); }}
                                        className='p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors'
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { setShowCityDropdown(!showCityDropdown); setShowCountryDropdown(false); }}
                                    className='w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-primary/50 transition-colors'
                                >
                                    <div className='flex items-center gap-2'>
                                        <MapPin className='text-slate-400' size={16} />
                                        <span className={`font-bold text-sm ${selectedCity ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                                            {selectedCity || "All Cities"}
                                        </span>
                                    </div>
                                    <ChevronDown className={`text-slate-400 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} size={16} />
                                </button>
                            )}
                            <AnimatePresence>
                                {showCityDropdown && !showCustomInput && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -5, scale: 0.98 }}
                                        transition={{ duration: 0.15 }}
                                        className='absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto custom-scrollbar'
                                    >
                                        {/* All Cities option */}
                                        <button
                                            onClick={() => { setSelectedCity(""); setShowCityDropdown(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5 dark:hover:bg-primary/10 border-b border-slate-100 dark:border-slate-800 ${
                                                !selectedCity ? 'text-primary bg-primary/5 font-bold' : 'text-slate-600 dark:text-slate-300'
                                            }`}
                                        >
                                            🌐 All Cities in {selectedCountry}
                                        </button>

                                        {cities.map((city) => (
                                            <button
                                                key={city}
                                                onClick={() => { setSelectedCity(city); setShowCityDropdown(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5 dark:hover:bg-primary/10 ${
                                                    selectedCity === city
                                                        ? 'text-primary bg-primary/5 dark:bg-primary/10 font-bold'
                                                        : 'text-slate-600 dark:text-slate-300'
                                                }`}
                                            >
                                                {city}
                                            </button>
                                        ))}

                                        {/* Add Custom City */}
                                        <button
                                            onClick={() => { setShowCustomInput(true); setShowCityDropdown(false); }}
                                            className='w-full text-left px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors border-t border-slate-100 dark:border-slate-800 flex items-center gap-2'
                                        >
                                            <Plus size={14} />
                                            Add other city manually
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Location Preview Badge */}
                        <div className='flex items-center px-4 py-2 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20'>
                            <MapPin className='text-primary shrink-0' size={14} />
                            <span className='ml-2 text-xs font-bold text-primary truncate max-w-[200px]'>
                                {getLocationQuery()}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Search Bar */}
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
