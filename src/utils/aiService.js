import Groq from "groq-sdk";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Lazy-init: only create the Groq client when actually needed, so a missing key
// doesn't crash the entire app on startup.
let _groq = null;
const getGroq = () => {
    if (!_groq) {
        if (!API_KEY) throw new Error("Groq API Key is not configured. Please set VITE_GROQ_API_KEY in your .env file.");
        _groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });
    }
    return _groq;
};

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

/**
 * Helper to call Groq chat completion
 */
const callGroq = async (prompt, jsonMode = false) => {
    const groq = getGroq();

    const options = {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2048,
    };
    if (jsonMode) {
        options.response_format = { type: "json_object" };
    }

    const response = await groq.chat.completions.create(options);
    return response.choices[0].message.content;
};

export const getJobInsights = async (careerTitle) => {
    try {
        const prompt = `Act as a career expert and job market researcher. 
For the career path: "${careerTitle}", provide a detailed JSON response with:
1. "marketOverview": A 2-sentence summary of the current job market for this role.
2. "typicalSalaries": An object with "entry", "mid", and "senior" average annual salaries in USD.
3. "topCompanies": A list of 5 real global companies known for hiring this role.
4. "jobSearchKeywords": 5 specific keywords to use in job boards for best results.
5. "growthRate": A percentage or description of projected growth over 5 years.

Return ONLY the raw JSON.`;

        const text = await callGroq(prompt, true);
        return extractJSON(text);
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
    // Extract profile slug/name from the LinkedIn URL for context
    let profileHint = '';
    try {
        const parts = linkedinUrl.split('/in/');
        if (parts.length > 1) {
            const slug = parts[1].split('/')[0].split('?')[0];
            profileHint = slug.replace(/[-_0-9]+/g, ' ').trim();
        }
    } catch (e) { /* ignore */ }

    const prompt = `You are an elite AI & Automation Threat Analyst. You must analyze a LinkedIn profile and produce a brutally honest, personalized AI threat assessment.

LinkedIn Profile URL: "${linkedinUrl}"
${profileHint ? `Profile name hint (from URL slug): "${profileHint}"` : ''}

IMPORTANT INSTRUCTIONS:
1. From the LinkedIn URL, infer the person's likely name, professional role, industry, and seniority level.
2. Personalize EVERY part of the response to this specific person — mention their likely job title, industry, skills, and name where possible.
3. Do NOT give generic responses. Each description must reference details about THIS person's likely career.
4. Use a provocative, neo-brutalist "roast" tone — witty, sharp, but insightful.
5. The overallScore should realistically reflect how replaceable their role is by AI (0.1 = impossible to replace, 10.0 = fully automatable).

Return a JSON object with these EXACT fields:
- "profileName": The person's likely full name (inferred from URL).
- "profileRole": Their likely current job title / role.
- "profileIndustry": Their likely industry.
- "roleTitle": A bold, ALL-CAPS persona title that reflects their career (e.g., "THE CLOUD WHISPERER", "THE DATA PROPHET", "THE CODE MERCENARY"). Must be unique to them.
- "roleDescription": A 2-3 sentence personalized summary mentioning their name, role, and specific AI risk to their career. Be specific — reference their industry and what parts of their job AI threatens.
- "overallScore": A number from 0.1 to 10.0 (10 = highest replacement risk).
- "categories": An array of exactly 4 objects:
  1. "TECHNICAL SKILLS" — assess their likely technical depth and how AI competes with it. Mention specific technologies/skills relevant to their role.
  2. "AI ADAPTABILITY" — how well their role adapts to AI tools. Reference specific AI tools relevant to their industry.
  3. "CAREER MOAT" — how defensible their position is. Mention what makes their specific role hard or easy to automate.
  4. "MARKET POSITIONING" — their market value trajectory. Reference industry trends specific to their field.
  Each category object must have:
  - "name": The category name (uppercase).
  - "score": A number from 0.1 to 10.0.
  - "description": 2-3 sentences, personalized to THIS person, in a sharp analytical/roast style.

Return ONLY the raw JSON object. No markdown, no explanation.`;

    try {
        const text = await callGroq(prompt, true);
        return extractJSON(text);
    } catch (error) {
        console.error("AI Threat Assessment Error:", error);
        throw new Error(error.message || "AI analysis failed. The Groq API may be unavailable or the API key may be invalid.");
    }
};

export const enhanceResumeBullet = async (role, bullet) => {
    try {
        const prompt = `Act as a professional resume writer. 
Transform the following basic job description bullet point for a "${role}" role into a "High Impact" professional statement using the STAR method.
Basic Point: "${bullet}"
Return ONLY the enhanced bullet point text.`;

        const text = await callGroq(prompt);
        return text.trim();
    } catch (error) {
        console.error("AI Enhance Error:", error);
        return bullet;
    }
};
