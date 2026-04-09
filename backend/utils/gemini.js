import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Gemini 1.5 Flash is the most cost-effective (and often free) model
const GEMINI_MODEL = "gemini-3-flash-preview";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Evaluates the match between a job and a user profile using Gemini AI.
 * @param {Object} job - The job object (title, description, requirements).
 * @param {Object} user - The user object (profile.skills, profile.bio).
 * @returns {Promise<{score: number, reasoning: string}>}
 */
export const evaluateJobMatch = async (job, user) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY; // Ensure this is in your .env
        if (!apiKey) {
            console.error("GEMINI_API_KEY is not set in environment variables.");
            return { score: 0, reasoning: "API key missing." };
        }

        const userSkills = user.profile.skills.join(", ");
        const userBio = user.profile.bio || "No bio provided.";
        const jobRequirements = job.requirements.join(", ");

        const prompt = `
        You are an expert recruitment AI. Analyze the match between the following job and user profile.
        
        JOB DETAILS:
        Title: ${job.title}
        Description: ${job.description}
        Requirements: ${jobRequirements}
        
        USER PROFILE:
        Skills: ${userSkills}
        Bio: ${userBio}
        
        Rate the match on a scale of 0 to 100.
        Consider skill overlap, experience relevance, and role fit.
        Return ONLY a JSON object in this format:
        {
            "score": number,
            "reasoning": "brief explanation"
        }
        `;

        const response = await axios.post(
            `${GEMINI_API_URL}?key=${apiKey}`,
            {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    response_mime_type: "application/json", // Ensures valid JSON output
                    temperature: 0.1, // Low temperature for more consistent scoring
                }
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        // Gemini's response structure is different from Grok/OpenAI
        const content = response.data.candidates[0].content.parts[0].text;
        const result = JSON.parse(content);

        return result;

    } catch (error) {
        console.error("Error calling Gemini AI:", error.response?.data || error.message);

        // Handle specific Gemini errors (like rate limits on free tier)
        if (error.response?.status === 429) {
            console.warn("Rate limit reached. Gemini Free tier has limits per minute.");
        }

        return { score: 0, reasoning: "Error evaluating match." };
    }
};

/**
 * Generates a professional profile summary using Gemini AI.
 * @param {string[]} skills - Array of user skills.
 * @param {string} bio - User's bio text.
 * @param {string} role - 'student' or 'recruiter'.
 * @param {string} resumeName - Original resume file name (optional context).
 * @returns {Promise<string>} A 2-4 sentence professional summary.
 */
export const generateProfileSummary = async (skills, bio, role, resumeName = "") => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY is not set.");
            return "";
        }

        const skillsList = Array.isArray(skills) ? skills.join(", ") : skills || "Not provided";
        const roleContext = role === "recruiter"
            ? "This person is a recruiter/hiring manager looking for talent."
            : "This person is a job-seeking student/professional looking for opportunities.";

        const prompt = `
        You are a professional career coach. Generate a concise, compelling 2-4 sentence professional summary for a user profile.
        
        ROLE: ${role}
        ${roleContext}
        
        SKILLS: ${skillsList}
        BIO: ${bio || "Not provided"}
        ${resumeName ? `RESUME FILE: ${resumeName}` : ""}
        
        Write the summary in first person. Make it sound professional, confident, and relevant to their role.
        Return ONLY the summary text, no JSON, no quotes, no extra formatting.
        `;

        const response = await axios.post(
            `${GEMINI_API_URL}?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7 }
            },
            { headers: { "Content-Type": "application/json" } }
        );

        const content = response.data.candidates[0].content.parts[0].text;
        return content.trim();
    } catch (error) {
        console.error("Error generating profile summary:", error.response?.data || error.message);
        return "";
    }
};

/**
 * Generates a concise job summary using Gemini AI.
 * @param {string} title - Job title.
 * @param {string} description - Full job description.
 * @param {string[]} requirements - Array of job requirements.
 * @returns {Promise<string>} A 2-3 sentence job summary.
 */
export const generateJobSummary = async (title, description, requirements) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY is not set.");
            return "";
        }

        const reqList = Array.isArray(requirements) ? requirements.join(", ") : requirements || "Not specified";

        const prompt = `
        You are a professional HR writer. Generate a concise, engaging 2-3 sentence job summary for a job listing.
        
        JOB TITLE: ${title}
        DESCRIPTION: ${description}
        REQUIREMENTS: ${reqList}
        
        The summary should highlight key responsibilities, required skills, and what makes this role attractive.
        Return ONLY the summary text, no JSON, no quotes, no extra formatting.
        `;

        const response = await axios.post(
            `${GEMINI_API_URL}?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7 }
            },
            { headers: { "Content-Type": "application/json" } }
        );

        const content = response.data.candidates[0].content.parts[0].text;
        return content.trim();
    } catch (error) {
        console.error("Error generating job summary:", error.response?.data || error.message);
        return "";
    }
};