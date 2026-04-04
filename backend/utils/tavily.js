import { tavily } from "@tavily/core";
import dotenv from "dotenv";

dotenv.config();

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

/**
 * Searches for jobs on the web using Tavily.
 * @param {string} query - Search query (e.g., "Software Engineer jobs in New York").
 * @param {number} maxResults - Maximum results to return (default 10).
 * @returns {Promise<Array>} - List of search results with title and url.
 */
export const searchExternalJobs = async (query, maxResults = 10) => {
    try {
        const response = await tvly.search(query, {
            searchDepth: "advanced",
            maxResults: maxResults,
            includeDomains: ["linkedin.com", "indeed.com", "glassdoor.com", "monster.com", "simplyhired.com"]
        });
        return response.results;
    } catch (error) {
        console.error("Error searching with Tavily:", error);
        return [];
    }
};

/**
 * Extracts job details from a list of URLs.
 * @param {Array<string>} urls - List of job posting URLs.
 * @returns {Promise<Array>} - Extracted job details (title, content, url).
 */
export const extractJobDetails = async (urls) => {
    try {
        const response = await tvly.extract(urls, {
            extractDepth: "advanced"
        });
        return response.results;
    } catch (error) {
        console.error("Error extracting with Tavily:", error);
        return [];
    }
};
