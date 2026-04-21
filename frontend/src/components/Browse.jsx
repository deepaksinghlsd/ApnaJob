import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { SearchX, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Browse = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const dispatch = useDispatch();
    
    useEffect(() => {
        return () => {
            // dispatch(setSearchedQuery("")); // Keep it if we want to pass it to global search
        }
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020817]">
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <h1 className='font-bold text-2xl my-10 dark:text-white'>
                    Search Results ({allJobs.length})
                    {searchedQuery && <span className="text-slate-500 font-medium"> for "{searchedQuery}"</span>}
                </h1>
                
                {allJobs.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {allJobs.map((job) => (
                            <Job key={job._id} job={job} />
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm'>
                        <div className='h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6'>
                            <SearchX className='text-slate-400' size={40} />
                        </div>
                        <h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>No local matches found</h2>
                        <p className='text-slate-500 dark:text-slate-400 max-w-md mb-8'>
                            We couldn't find any jobs in our database matching your criteria. Try searching the entire web instead!
                        </p>
                        
                        <Link 
                            to="/global-search" 
                            className='flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25'
                        >
                            <Globe size={20} />
                            Search Global Opportunities
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Browse