import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setSearchCompanyByText(input));
    },[input]);
    return (
        <div className='min-h-screen bg-slate-50 dark:bg-[#020817]'>
            <Navbar />
            <div className='max-w-7xl mx-auto pt-28 px-4 md:px-8 pb-10'>
                <div className='flex items-center justify-between mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm'>
                    <Input
                        className="w-fit border-slate-200 dark:border-slate-700 rounded-xl"
                        placeholder="Filter by name"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button 
                        onClick={() => navigate("/admin/companies/create")}
                        className="rounded-xl font-bold px-6"
                    >
                        New Company
                    </Button>
                </div>
                <div className='bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm'>
                    <CompaniesTable/>
                </div>
            </div>
        </div>
    )
}

export default Companies