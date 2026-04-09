import cron from 'node-cron';
import { Job } from '../models/job.model.js';
import { User } from '../models/user.model.js';
import { Application } from '../models/application.model.js';
import { Notification } from '../models/notification.model.js';
import { evaluateJobMatch } from '../utils/gemini.js';

/**
 * Periodically checks for new jobs and matches them with students who have auto-apply enabled.
 * Runs every day at midnight to catch any missed matches.
 */
export const initAutoApplyScheduler = () => {
    // Run every day at 00:00
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily auto-apply scheduler...');
        try {
            // Get jobs created in the last 24 hours
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const recentJobs = await Job.find({ createdAt: { $gte: yesterday } });
            
            if (recentJobs.length === 0) {
                console.log('No recent jobs to process.');
                return;
            }

            const students = await User.find({ role: 'student', autoApplyEnabled: true });

            for (const job of recentJobs) {
                for (const student of students) {
                    // Skip if already applied
                    const existingApplication = await Application.findOne({ job: job._id, applicant: student._id });
                    if (existingApplication) continue;

                    // Match logic
                    if (!student.profile || !student.profile.skills || student.profile.skills.length === 0) continue;

                    const matchResult = await evaluateJobMatch(job, student);
                    const { score, reasoning } = matchResult;

                    if (score >= 80) {
                        await Application.create({
                            job: job._id,
                            applicant: student._id,
                            status: 'pending'
                        });

                        await Notification.create({
                            user: student._id,
                            message: `[Auto-Match] Applied to ${job.title}! Match score: ${score}%. Reason: ${reasoning}`,
                            type: 'auto-apply',
                            job: job._id
                        });
                        console.log(`Auto-applied Student ${student.fullname} to Job ${job.title}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error in auto-apply scheduler:', error);
        }
    });
    
    console.log('Auto-apply scheduler initialized.');
};
