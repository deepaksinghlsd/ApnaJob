import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Building2, Briefcase, Calendar, Users } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminJobsTable = () => { 
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(()=>{ 
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());
        });
        setFilterJobs(filteredJobs);
    },[allAdminJobs, searchJobByText])

    return (
        <div className='bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm'>
            <Table>
                <TableCaption className="pb-4 text-xs font-medium text-slate-400">Manage your posted career opportunities</TableCaption>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="py-4 font-bold text-slate-700 dark:text-slate-200">
                           <div className='flex items-center gap-2'><Building2 size={14} /> Company</div>
                        </TableHead>
                        <TableHead className="py-4 font-bold text-slate-700 dark:text-slate-200">
                           <div className='flex items-center gap-2'><Briefcase size={14} /> Role</div>
                        </TableHead>
                        <TableHead className="py-4 font-bold text-slate-700 dark:text-slate-200">
                           <div className='flex items-center gap-2'><Calendar size={14} /> Date</div>
                        </TableHead>
                        <TableHead className="py-4 font-bold text-slate-700 dark:text-slate-200 text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-40 text-center">
                                    <div className='flex flex-col items-center justify-center gap-3'>
                                        <div className='h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center'>
                                            <Briefcase className='h-6 w-6 text-slate-300' />
                                        </div>
                                        <p className="text-slate-400 italic text-sm font-medium">No jobs found. Try posting one!</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filterJobs?.map((job) => (
                            <motion.tr 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key={job._id} 
                                className="group border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                            >
                                <TableCell className="py-5">
                                    <div className='flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold'>
                                        {job?.company?.name}
                                    </div>
                                </TableCell>
                                <TableCell className="py-5 font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
                                    {job?.title}
                                </TableCell>
                                <TableCell className="py-5 text-slate-500 dark:text-slate-400 font-medium">
                                    {job?.createdAt.split("T")[0]}
                                </TableCell>
                                <TableCell className="py-5 text-right">
                                    <Popover>
                                        <PopoverTrigger>
                                            <div className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer inline-block'>
                                                <MoreHorizontal size={18} className='text-slate-500' />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40 p-2 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl shadow-xl">
                                            <div 
                                                onClick={()=> navigate(`/admin/companies/${job._id}`)} 
                                                className='flex items-center gap-3 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors group'
                                            >
                                                <Edit2 size={14} className='text-slate-400 group-hover:text-primary' />
                                                <span className='text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary'>Edit Job</span>
                                            </div>
                                            <div 
                                                onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)} 
                                                className='flex items-center gap-3 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors group'
                                            >
                                                <Users size={14} className='text-slate-400 group-hover:text-primary' />
                                                <span className='text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary'>View Applicants</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </motion.tr>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable