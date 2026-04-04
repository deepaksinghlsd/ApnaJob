import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

/**
 * Evaluates the match between a job and a user profile using Grok AI.
 * @param {Object} job - The job object (title, description, requirements).
 * @param {Object} user - The user object (profile.skills, profile.bio).
 * @returns {Promise<{score: number, reasoning: string}>}
 */
export const evaluateJobMatch = async (job, user) => {
    try {
        const apiKey = process.env.GROK_API_KEY;
        if (!apiKey) {
            console.error("GROK_API_KEY is not set in environment variables.");
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
            GROK_API_URL,
            {
                model: "grok-beta",
                messages: [
                    { role: "system", content: "You are a professional recruiting assistant." },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const result = JSON.parse(response.data.choices[0].message.content);
        return result;

    } catch (error) {
        console.error("Error calling Grok AI:", error.response?.data || error.message);
        return { score: 0, reasoning: "Error evaluating match." };
    }
};
