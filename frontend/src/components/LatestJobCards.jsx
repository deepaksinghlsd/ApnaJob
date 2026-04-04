import React from 'react';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Building2, Clock } from 'lucide-react';

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    // Format salary in lakhs
    const formatSalary = (salary) => {
        if (!salary) return 'Not disclosed';
        return `₹${salary} LPA`;
    };

    // Get days ago from posted date
    const getDaysAgo = (date) => {
        if (!date) return 'Recently';
        const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
        return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`;
    };

    return (
        <div 
            className="group bg-white rounded-xl border border-gray-100 hover:border-[#6A38C2]/30 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => navigate(`/description/${job._id}`)}
        >
            {/* Company Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                    {/* Company Logo and Info */}
                    <div className="flex items-center gap-4">
                        {/* Logo */}
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                            {job?.company?.logo ? (
                                <img 
                                    src={job.company.logo} 
                                    alt={job.company.name} 
                                    className="w-10 h-10 object-contain"
                                />
                            ) : (
                                <Building2 className="w-6 h-6 text-gray-400" />
                            )}
                        </div>

                        {/* Company Details */}
                        <div>
                            <a 
                                href={job?.company?.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-[#6A38C2] transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="font-semibold text-gray-900">
                                    {job?.company?.name || 'Company Name'}
                                </h3>
                            </a>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{job?.company?.location || job?.location || 'India'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Posted Time */}
                    <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>{getDaysAgo(job?.createdAt)}</span>
                    </div>
                </div>

                {/* Job Title & Description */}
                <div className="mt-4">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#6A38C2] transition-colors line-clamp-1">
                        {job?.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {job?.description}
                    </p>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {/* Job Type */}
                    <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 capitalize">{job?.jobType || 'Full time'}</span>
                    </div>
                    
                    {/* Salary */}
                    <div className="flex items-center gap-2 text-sm">
                        <IndianRupee className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 font-medium">{formatSalary(job?.salary)}</span>
                    </div>
                </div>

                {/* Positions Available */}
                <div className="mt-3 text-sm">
                    <span className="text-[#6A38C2] font-semibold">{job?.position || 1}</span>
                    <span className="text-gray-500"> positions available</span>
                </div>
            </div>

            {/* Footer with Skills/Tags */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                    {job?.skills?.slice(0, 3).map((skill, index) => (
                        <Badge 
                            key={index}
                            variant="secondary"
                            className="bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        >
                            {skill}
                        </Badge>
                    ))}
                    {job?.skills?.length > 3 && (
                        <Badge 
                            variant="secondary"
                            className="bg-white text-gray-600 border border-gray-200"
                        >
                            +{job.skills.length - 3} more
                        </Badge>
                    )}
                </div>

                {/* View Details Button */}
                <div className="mt-4 text-right">
                    <span className="inline-flex items-center text-sm font-medium text-[#6A38C2] group-hover:gap-2 transition-all">
                        View Details
                        <svg 
                            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LatestJobCards;