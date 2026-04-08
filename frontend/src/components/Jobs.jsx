import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.jobType?.toLowerCase().includes(searchedQuery.toLowerCase())
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className='min-h-screen bg-slate-50 dark:bg-[#020817]'>
            <Navbar />

            <div className='max-w-7xl mx-auto pt-24 px-4 md:px-8 pb-10'>
                <div className='flex gap-6'>
                    {/* Filter Sidebar */}
                    <div className='hidden md:block w-72 shrink-0'>
                        <FilterCard />
                    </div>

                    {/* Jobs Grid */}
                    {filterJobs.length <= 0 ? (
                        <div className='flex-1 flex flex-col items-center justify-center py-32 text-center'>
                            <div className='h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6'>
                                <SearchX className='text-slate-300 dark:text-slate-600' size={36} />
                            </div>
                            <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>No jobs found</h3>
                            <p className='text-sm text-slate-500 dark:text-slate-400 max-w-sm'>
                                Try adjusting your filters or search with different keywords to find matching opportunities.
                            </p>
                        </div>
                    ) : (
                        <div className='flex-1 overflow-y-auto pb-5'>
                            <div className='flex items-center justify-between mb-6'>
                                <p className='text-sm font-bold text-slate-500 dark:text-slate-400'>
                                    Showing <span className='text-primary'>{filterJobs.length}</span> jobs
                                    {searchedQuery && <span> for "<span className='text-slate-800 dark:text-white'>{searchedQuery}</span>"</span>}
                                </p>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                                {
                                    filterJobs.map((job) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ duration: 0.3 }}
                                            key={job?._id}>
                                            <Job job={job} />
                                        </motion.div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Jobs