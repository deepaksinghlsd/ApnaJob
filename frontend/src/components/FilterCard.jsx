import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { MapPin, Briefcase, DollarSign, Star, X, SlidersHorizontal, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fallback static data in case API has no jobs yet
const fallbackFilters = {
    locations: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Kolkata", "Remote"],
    jobTypes: ["Full Time", "Part Time", "Contract", "Internship", "Freelance"],
    titles: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "DevOps Engineer", "UI/UX Designer", "Mobile Developer", "Cloud Engineer"],
    salaryRanges: ["0 - 5 LPA", "5 - 10 LPA", "10 - 20 LPA", "20 - 50 LPA", "50+ LPA"],
};

const filterIcons = {
    "Location": MapPin,
    "Job Type": Briefcase,
    "Role": Star,
    "Salary": DollarSign,
};

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [filterData, setFilterData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${JOB_API_END_POINT}/get/filters`, { withCredentials: true });
                if (res.data.success) {
                    const { locations, jobTypes, titles, salaryRanges } = res.data.filters;
                    const dynamicFilters = [];

                    if (locations && locations.length > 0) {
                        dynamicFilters.push({ filterType: "Location", array: locations });
                    } else {
                        dynamicFilters.push({ filterType: "Location", array: fallbackFilters.locations });
                    }

                    if (titles && titles.length > 0) {
                        dynamicFilters.push({ filterType: "Role", array: titles });
                    } else {
                        dynamicFilters.push({ filterType: "Role", array: fallbackFilters.titles });
                    }

                    if (jobTypes && jobTypes.length > 0) {
                        dynamicFilters.push({ filterType: "Job Type", array: jobTypes });
                    } else {
                        dynamicFilters.push({ filterType: "Job Type", array: fallbackFilters.jobTypes });
                    }

                    if (salaryRanges && salaryRanges.length > 0) {
                        dynamicFilters.push({ filterType: "Salary", array: salaryRanges });
                    } else {
                        dynamicFilters.push({ filterType: "Salary", array: fallbackFilters.salaryRanges });
                    }

                    setFilterData(dynamicFilters);
                }
            } catch (error) {
                console.log("Error fetching filters, using fallback:", error);
                setFilterData([
                    { filterType: "Location", array: fallbackFilters.locations },
                    { filterType: "Role", array: fallbackFilters.titles },
                    { filterType: "Job Type", array: fallbackFilters.jobTypes },
                    { filterType: "Salary", array: fallbackFilters.salaryRanges },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchFilters();
    }, []);

    const changeHandler = (value) => {
        setSelectedValue(value);
    };

    const clearFilter = () => {
        setSelectedValue('');
    };

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-xs sticky top-20"
        >
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-lg dark:shadow-slate-950/50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                            <SlidersHorizontal className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="font-bold text-base text-slate-800 dark:text-slate-100">
                            Filters
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedValue && (
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                onClick={clearFilter}
                                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                            >
                                <X className="h-3 w-3" />
                                Clear
                            </motion.button>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all md:hidden"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Active Filter Badge */}
                <AnimatePresence>
                    {selectedValue && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="px-5 py-3 bg-primary/5 dark:bg-primary/10 border-b border-slate-100 dark:border-slate-800">
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">Active filter:</p>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold">
                                    {selectedValue}
                                    <button onClick={clearFilter} className="hover:bg-primary/20 dark:hover:bg-primary/30 rounded-full p-0.5 transition-colors">
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filter Content */}
                <div className={`transition-all duration-300 ${isCollapsed ? 'max-h-0 overflow-hidden md:max-h-none' : 'max-h-[65vh]'} overflow-y-auto custom-scrollbar`}>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <Loader2 className="h-6 w-6 text-primary animate-spin" />
                            <p className="text-sm text-slate-400 dark:text-slate-500">Loading filters...</p>
                        </div>
                    ) : (
                        <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                            {filterData.map((data, index) => {
                                const Icon = filterIcons[data.filterType] || Star;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                        className="px-5 py-4 border-b border-slate-50 dark:border-slate-800/50 last:border-b-0 "
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <Icon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                            <h3 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                {data.filterType}
                                            </h3>
                                            <span className="ml-auto text-[10px] font-medium text-slate-300 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                                {data.array.length}
                                            </span>
                                        </div>
                                        <div className="space-y-0.5">
                                            {data.array.map((item, idx) => {
                                                const itemId = `filter-${index}-${idx}`;
                                                const isSelected = selectedValue === item;
                                                return (
                                                    <label
                                                        key={itemId}
                                                        htmlFor={itemId}
                                                        className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200
                                                            ${isSelected
                                                                ? 'bg-primary/10 dark:bg-primary/15 border border-primary/20 dark:border-primary/30'
                                                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
                                                            }
                                                        `}
                                                    >
                                                        <RadioGroupItem
                                                            value={item}
                                                            id={itemId}
                                                            className="border-slate-300 dark:border-slate-600 text-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                                        />
                                                        <Label
                                                            htmlFor={itemId}
                                                            className={`text-sm cursor-pointer transition-colors ${isSelected
                                                                ? 'font-semibold text-primary dark:text-primary'
                                                                : 'font-medium text-slate-600 dark:text-slate-300'
                                                                }`}
                                                        >
                                                            {item}
                                                        </Label>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </RadioGroup>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default FilterCard;
