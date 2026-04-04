import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";
import { Notification } from "../models/notification.model.js";
import { evaluateJobMatch } from "../utils/grok.js";
import { searchExternalJobs as tavilySearch, extractJobDetails } from "../utils/tavily.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        // Trigger auto-apply process in the background
        processAutoApply(job);

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// Search for jobs from external sources (Tavily)
export const searchExternalJobs = async (req, res) => {
    try {
        const { keyword, location, maxResults = 10 } = req.body;
        const query = `${keyword} jobs in ${location || 'India'}`;
        
        console.log(`Searching external jobs for: ${query}`);
        const results = await tavilySearch(query, maxResults);
        
        if (!results || results.length === 0) {
            return res.status(200).json({
                message: "No external jobs found.",
                jobs: [],
                success: true
            });
        }

        // Return basic search results immediately for responsiveness
        return res.status(200).json({
            jobs: results,
            success: true
        });
    } catch (error) {
        console.error("Error in searchExternalJobs:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

// Match external jobs with user resume using Grok AI
export const matchExternalJobs = async (req, res) => {
    try {
        const { jobs } = req.body;
        const userId = req.id;
        const student = await User.findById(userId);

        if (!student || !student.profile || !student.profile.skills) {
            return res.status(400).json({
                message: "User profile or skills missing for matching.",
                success: false
            });
        }

        console.log(`Matching ${jobs?.length} external jobs for user: ${student.fullname}`);
        
        // For external jobs, we might not have full 'requirements' array yet, so we use description/title
        const rankedJobs = await Promise.all(jobs.map(async (job) => {
            const formattedJob = {
                title: job.title,
                description: job.content || job.snippet || "No description provided.",
                requirements: [] // External results usually don't have separate requirements
            };
            
            const matchResult = await evaluateJobMatch(formattedJob, student);
            return {
                ...job,
                matchScore: matchResult.score,
                matchReasoning: matchResult.reasoning
            };
        }));

        // Sort by score descending
        const sortedJobs = rankedJobs.sort((a, b) => b.matchScore - a.matchScore);

        return res.status(200).json({
            jobs: sortedJobs,
            success: true
        });
    } catch (error) {
        console.error("Error in matchExternalJobs:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

// Background process for auto job apply and notifications
async function processAutoApply(job) {
    try {
        // Fetch all students
        const students = await User.find({ role: 'student' });
        
        for (const student of students) {
            // Check if student has a profile and skills
            if (!student.profile || !student.profile.skills || student.profile.skills.length === 0) continue;

            const matchResult = await evaluateJobMatch(job, student);
            const { score, reasoning } = matchResult;

            if (score >= 80) {
                // Auto-apply
                const existingApplication = await Application.findOne({ job: job._id, applicant: student._id });
                if (!existingApplication) {
                    await Application.create({
                        job: job._id,
                        applicant: student._id,
                        status: 'pending'
                    });

                    await Notification.create({
                        user: student._id,
                        message: `Auto-applied to ${job.title}! Match score: ${score}%. Reason: ${reasoning}`,
                        type: 'auto-apply',
                        job: job._id
                    });
                }
            } else if (score >= 60) {
                // Relevant job notification
                await Notification.create({
                    user: student._id,
                    message: `New job alert: ${job.title} matches your profile (${score}%)!`,
                    type: 'job-alert',
                    job: job._id
                });
            }
        }
    } catch (error) {
        console.error("Error in processAutoApply:", error);
    }
}
