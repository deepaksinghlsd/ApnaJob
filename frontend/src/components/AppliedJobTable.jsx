import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Calendar, Briefcase, Building2, CheckCircle2, Clock, XCircle } from 'lucide-react'

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);

    const getStatusBadge = (status) => {
        const lowerCaseStatus = status.toLowerCase();
        if (lowerCaseStatus === "accepted") {
            return (
                <div className='flex items-center gap-2 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-100 dark:border-green-500/20 shadow-sm shadow-green-500/5 transition-all w-fit ml-auto'>
                    <CheckCircle2 size={14} />
                    <span className='text-[10px] uppercase tracking-wider'>Selected</span>
                </div>
            );
        } else if (lowerCaseStatus === "rejected") {
            return (
                <div className='flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-100 dark:border-rose-500/20 shadow-sm shadow-rose-500/5 transition-all w-fit ml-auto'>
                    <XCircle size={14} />
                    <span className='text-[10px] uppercase tracking-wider'>Rejected</span>
                </div>
            );
        } else {
            return (
                <div className='flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-500/20 shadow-sm shadow-amber-500/5 transition-all w-fit ml-auto'>
                    <Clock size={14} />
                    <span className='text-[10px] uppercase tracking-wider'>Pending</span>
                </div>
            );
        }
    }

    return (
        <div className='bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm'>
            <Table>
                <TableCaption className="pb-4 text-xs font-medium text-slate-400">A historical record of your career steps</TableCaption>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="py-4 font-bold text-slate-700 dark:text-slate-200">
                           <div className='flex items-center gap-2'><Calendar size={14} /> Date</div>
                        </TableHead>
                        <TableHead className="py-4 font-bold text-slate-700 dark:text-slate-200">
                           <div className='flex items-center gap-2'><Briefcase size={14} /> Job Role</div>
                        </TableHead>
                        <TableHead className="py-4 font-bold text-slate-700 dark:text-slate-200">
                           <div className='flex items-center gap-2'><Building2 size={14} /> Company</div>
                        </TableHead>
                        <TableHead className="py-4 font-bold text-slate-700 dark:text-slate-200 text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? (
                            <TableRow className="border-none">
                                <TableCell colSpan={4} className="h-40 text-center">
                                    <div className='flex flex-col items-center justify-center gap-3'>
                                        <div className='h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center'>
                                            <Briefcase className='h-6 w-6 text-slate-300' />
                                        </div>
                                        <p className="text-slate-400 italic text-sm font-medium">You haven't applied to any jobs yet.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : allAppliedJobs.map((appliedJob) => (
                            <motion.tr 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key={appliedJob._id} 
                                className="group border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                            >
                                <TableCell className="py-5 font-medium text-slate-500 dark:text-slate-400">
                                    {appliedJob?.createdAt?.split("T")[0]}
                                </TableCell>
                                <TableCell className="py-5">
                                    <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                                        {appliedJob.job?.title}
                                    </span>
                                </TableCell>
                                <TableCell className="py-5">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold">
                                        {appliedJob.job?.company?.name}
                                    </div>
                                </TableCell>
                                <TableCell className="py-5 text-right">
                                    {getStatusBadge(appliedJob.status)}
                                </TableCell>
                            </motion.tr>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable