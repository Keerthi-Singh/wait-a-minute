import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Extracts JSON from a string that might contain markdown or other text.
 */
const extractJSON = (text) => {
    try {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            const jsonPart = text.substring(start, end + 1);
            return JSON.parse(jsonPart);
        }
        return JSON.parse(text);
    } catch (e) {
        throw new Error("Could not parse AI response as JSON");
    }
};

export const getJobInsights = async (careerTitle) => {
    try {
        if (!API_KEY) throw new Error("Gemini API Key is not configured.");

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
            Act as a career expert and job market researcher. 
            For the career path: "${careerTitle}", provide a detailed JSON response with:
            1. "marketOverview": A 2-sentence summary of the current job market for this role.
            2. "typicalSalaries": An object with "entry", "mid", and "senior" average annual salaries in USD.
            3. "topCompanies": A list of 5 real global companies known for hiring this role.
            4. "jobSearchKeywords": 5 specific keywords to use in job boards for best results.
            5. "growthRate": A percentage or description of projected growth over 5 years.
            
            Return ONLY the raw JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return extractJSON(response.text());
    } catch (error) {
        console.error("Error fetching AI job insights:", error);
        return {
            marketOverview: `The market for ${careerTitle} is currently evolving with digital transformation.`,
            typicalSalaries: { entry: "60,000", mid: "90,000", senior: "130,000+" },
            topCompanies: ["TechCorp", "Innovate Solutions", "Global Systems", "Future Dynamics", "Enterprise Labs"],
            jobSearchKeywords: [careerTitle, "Senior " + careerTitle, "Lead " + careerTitle, "Remote " + careerTitle],
            growthRate: "Stable (Estimated 15% growth over 5 years)"
        };
    }
};

export const getAIThreatAssessment = async (linkedinUrl) => {
    try {
        if (!API_KEY) throw new Error("Gemini API Key is not configured.");

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
            Act as an AI and Automation Expert. 
            Analyze this LinkedIn Profile URL: "${linkedinUrl}".
            1. Infer the user's professional role and background.
            2. Provide a high-impact, slightly provocative professional threat assessment (Neo-Brutalist/Roast style).
            
            Return a JSON object with:
            - "roleTitle": A bold, capitalized title for their persona (e.g., "THE SYSTEM ARCHITECT", "THE DATA OVERLORD").
            - "roleDescription": A 2-3 sentence high-impact summary of their background and AI risk.
            - "overallScore": A number from 0.1 to 10.0 (where 10.0 is highest risk).
            - "categories": An array of exactly 4 objects for: "TECHNICAL SKILLS", "AI ADAPTABILITY", "CAREER MOAT", "MARKET POSITIONING".
              Each category object should have:
              - "name": The category name (uppercase).
              - "score": A number from 0.1 to 10.0.
              - "description": A short, impactful paragraph (2-3 sentences) explaining the score in a "roast" or highly analytical style.

            Return ONLY raw JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return extractJSON(response.text());
    } catch (error) {
        console.error("AI Threat Assessment Error:", error);
        return {
            roleTitle: "THE SHADOW OPERATIVE",
            roleDescription: "Your profile suggests a professional background in specialized operations. You're essentially working in the blind spots of automation, but for how long?",
            overallScore: 4.2,
            categories: [
                {
                    name: "TECHNICAL SKILLS",
                    score: 5.5,
                    description: "Your technical proficiency is adequate for the current decade, but you're competing with algorithms that don't need coffee breaks or sleep. You're a legacy system in a cloud-native world."
                },
                {
                    name: "AI ADAPTABILITY",
                    score: 3.8,
                    description: "You're slow to pivot. While the world is moving to generative workflows, you're still perfecting manual processes. You're bringing a knife to a laser fight."
                },
                {
                    name: "CAREER MOAT",
                    score: 4.5,
                    description: "Your moat is drying up. The niche expertise you rely on is being democratized by LLMs. Your 'unique' value proposition is one prompt away from being a commodity."
                },
                {
                    name: "MARKET POSITIONING",
                    score: 3.0,
                    description: "You're positioned in the path of the oncoming tide. Without a drastic rebrand into AI-augmented management, your resume will soon look like a museum artifact."
                }
            ]
        };
    }
};

export const enhanceResumeBullet = async (role, bullet) => {
    try {
        if (!API_KEY) throw new Error("Gemini API Key is not configured.");

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
            Act as a professional resume writer. 
            Transform the following basic job description bullet point for a "${role}" role into a "High Impact" professional statement using the STAR method.
            Basic Point: "${bullet}"
            Return ONLY the enhanced bullet point text.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("AI Enhance Error:", error);
        return bullet;
    }
};
