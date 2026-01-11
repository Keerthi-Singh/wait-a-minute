/**
 * Analyzes user answers and returns a career recommendation based on rule-based logic.
 * @param {Object} answers - Object where keys are question indices and values are the selected option strings.
 * @returns {Object} - The career recommendation object.
 */
export const analyzeCareer = (answers) => {
    const scores = {
        tech: 0,
        creative: 0,
        leadership: 0,
        social: 0,
        research: 0
    };

    // Iterate through answers and assign points to categories
    Object.entries(answers).forEach(([index, value]) => {
        const idx = parseInt(index);

        // Q1: Interests
        if (idx === 0) {
            if (value.includes('patterns and code')) scores.tech += 2;
            if (value.includes('visual elements')) scores.creative += 2;
            if (value.includes('Organizing people')) scores.leadership += 2;
            if (value.includes('Investigating data')) scores.research += 2;
        }
        // Q2: Subjects
        if (idx === 1) {
            if (value.includes('Engineering')) scores.tech += 2;
            if (value.includes('Psychology')) scores.social += 2;
            if (value.includes('Visual Arts')) scores.creative += 2;
            if (value.includes('Business')) scores.leadership += 2;
        }
        // Q3: Work style
        if (idx === 2) {
            if (value.includes('logical steps')) scores.tech += 1;
            if (value.includes('creative')) scores.creative += 2;
            if (value.includes('Delegating')) scores.leadership += 2;
            if (value.includes('Deep exploration')) scores.research += 1;
        }
        // Q4: Strengths
        if (idx === 3) {
            if (value.includes('analytical')) scores.tech += 1;
            if (value.includes('help people')) scores.social += 2;
            if (value.includes('artistic')) scores.creative += 2;
            if (value.includes('Leadership')) scores.leadership += 2;
        }
        // Q5: Tech vs Non-tech
        if (idx === 4) {
            if (value.includes('software')) scores.tech += 2;
            if (value.includes('Marketing')) scores.leadership += 1;
            if (value.includes('UI/UX')) scores.creative += 2;
            if (value.includes('Management')) scores.leadership += 2;
        }
        // Q6: Creativity vs Logic
        if (idx === 5) {
            if (value.includes('algorithms')) scores.tech += 2;
            if (value.includes('Instinct')) scores.creative += 2;
            if (value.includes('Practicality')) scores.leadership += 1;
            if (value.includes('Collaborative')) scores.social += 1;
        }
        // Q8: Career Goal
        if (idx === 7) {
            if (value.includes('Technical innovation')) scores.tech += 2;
            if (value.includes('Financial stability')) scores.leadership += 1;
            if (value.includes('Social impact')) scores.social += 2;
            if (value.includes('Personal prestige')) scores.leadership += 2;
        }
    });

    // Find the category with the highest score
    const topCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    const recommendations = {
        tech: {
            career: 'Full-Stack Software Engineer',
            description: 'You possess a strong logical mind and a passion for building complex systems. Your ability to break down problems makes you ideal for software architecture and technical innovation.',
            skills: ['System Design', 'JavaScript/TypeScript', 'Problem Solving', 'Algorithm Optimization'],
            goals: ['Lead a technical team', 'Build scalable applications', 'Master Cloud Infrastructure']
        },
        creative: {
            career: 'UI/UX Product Designer',
            description: 'Your blend of artistic vision and user-centric thinking suggests a brilliant career in design. You have a natural eye for aesthetics and how humans interact with digital spaces.',
            skills: ['Visual Design', 'User Research', 'Prototyping', 'Design Systems'],
            goals: ['Design world-class interfaces', 'Lead creative direction', 'Improve digital accessibility']
        },
        leadership: {
            career: 'Strategic Product Manager',
            description: 'You are a natural leader with a keen eye for business operations. You excel at organizing people, managing complex timelines, and driving high-level strategy.',
            skills: ['Strategic Planning', 'Agile Management', 'Data-Driven Decision Making', 'Stakeholder Communication'],
            goals: ['Executive leadership roles', 'Scaling business operations', 'Pioneering market entry']
        },
        social: {
            career: 'Human-Centered Program Manager',
            description: 'Your empathy and desire for social impact are your greatest assets. You excel in environments where you can help people and drive meaningful community or educational change.',
            skills: ['Empathy & EQ', 'Public Speaking', 'Program Development', 'Conflict Resolution'],
            goals: ['Create social impact', 'Design educational programs', 'Non-profit leadership']
        },
        research: {
            career: 'Data Scientist & AI Researcher',
            description: 'Your curiosity and analytical depth lead you toward the frontier of knowledge. You are best suited for roles that involve investigating data to find hidden insights.',
            skills: ['Statistical Analysis', 'Python/R', 'Machine Learning', 'Data Visualization'],
            goals: ['Publish groundbreaking research', 'Develop AI models', 'Influence policy through data']
        }
    };

    return recommendations[topCategory] || recommendations.tech;
};
