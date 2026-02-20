import { GoogleGenerativeAI } from "@google/generative-ai";

// For a "Big Project", you should use an Environment Variable (VITE_GEMINI_API_KEY)
// For now, I'll provide a placeholder. You can get a free key at:
// https://aistudio.google.com/app/apikey
// Use environment variable for security
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export const getJobInsights = async (careerTitle) => {
    try {
        if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY") {
            throw new Error("Please provide a valid Gemini API Key.");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
            Act as a career expert and job market researcher. 
            For the career path: "${careerTitle}", provide a detailed JSON response with:
            1. "marketOverview": A 2-sentence summary of the current job market for this role.
            2. "typicalSalaries": An object with "entry", "mid", and "senior" average annual salaries in USD.
            3. "topCompanies": A list of 5 real global companies known for hiring this role.
            4. "jobSearchKeywords": 5 specific keywords to use in job boards for best results.
            5. "growthRate": A percentage or description of projected growth over 5 years.
            
            Return ONLY the JSON. No Markdown formatting.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up text if it contains markdown code blocks
        const cleanedText = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error fetching AI job insights:", error);
        // Return dummy data if API fails or isn't configured
        return {
            marketOverview: `The market for ${careerTitle} is currently expanding as industries undergo digital transformation. Demand remains strong for talented individuals with niche skills.`,
            typicalSalaries: { entry: "65,000", mid: "95,000", senior: "135,000+" },
            topCompanies: ["Amazon", "Google", "Microsoft", "Meta", "Direct-to-Consumer Startups"],
            jobSearchKeywords: [careerTitle, "Senior " + careerTitle, "Junior " + careerTitle, "Remote " + careerTitle, "Contract"],
            growthRate: "High (Estimated 22% growth by 2030)"
        };
    }
};

export const enhanceResumeBullet = async (role, bullet) => {
    try {
        if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY") {
            throw new Error("Missing API Key");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
            Act as a professional resume writer. 
            Transform the following basic job description bullet point for a "${role}" role into a "High Impact" professional statement.
            Rule: Use the Star Method (Situation, Task, Action, Result). Include strong action verbs and metrics where possible.
            Basic Point: "${bullet}"
            Return ONLY the enhanced bullet point text.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("AI Enhance Error:", error);
        return bullet; // Return original if error
    }
};
