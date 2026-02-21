import { careers } from '../data/careers';

/**
 * Analyzes user answers and returns top career recommendations using a weighted scoring system.
 * @param {Object} answers - Keys are question indices, values are the strings selected.
 * @returns {Object} - Primary and secondary careers with details.
 */
export const analyzeCareer = (answers) => {
    // 1) Initialize scores
    let scoredCareers = careers.map(c => ({ ...c, score: 0, matchedTraits: [] }));

    // 2) Compare user answers
    // answers map to questions:
    // 0: interests, 1: subject, 2: workStyle, 3: strength,
    // 4: techVsNonTech, 5: creativityVsLogic, 6: teamVsIndividual, 7: goal

    scoredCareers.forEach(career => {
        // Evaluate Q1: Interests
        if (answers[0] === career.interests) {
            career.score += 3;
            career.matchedTraits.push("Core Interests");
        } else if (answers[0] && career.domain === "Technology" && answers[0].includes("logical")) {
            career.score += 1; // partial
        }

        // Evaluate Q2: Subjects
        if (answers[1] === career.subject) {
            career.score += 3;
            if (!career.matchedTraits.includes("Academic Focus")) career.matchedTraits.push("Academic Focus");
        } else if (answers[1] && career.domain === "Science & Core" && answers[1].includes("Engineering")) {
            career.score += 1;
        }

        // Evaluate Q3: Work Style
        if (answers[2] === career.workStyle) {
            career.score += 3;
            career.matchedTraits.push("Work Style");
        } else if (answers[2] && answers[2].includes("logical") && career.traits.includes("logic")) {
            career.score += 1;
        }

        // Evaluate Q4: Strengths
        if (answers[3] === career.strength) {
            career.score += 3;
            career.matchedTraits.push("Personal Strengths");
        } else if (answers[3] && answers[3].includes("artistic") && career.domain === "Creative") {
            career.score += 1;
        }

        // Evaluate Q5: Tech vs Non-tech
        if (answers[4] === career.techVsNonTech) {
            career.score += 3;
            career.matchedTraits.push("Industry Preference");
        } else if (answers[4] && answers[4].includes("software") && career.domain === "Technology") {
            career.score += 1;
        }

        // Evaluate Q6: Creativity vs Logic
        if (answers[5] === career.creativityVsLogic) {
            career.score += 3;
        } else if (answers[5] && answers[5].includes("Instinct") && career.traits.includes("creative")) {
            career.score += 1;
        }

        // Evaluate Q7: Team vs Individual
        if (answers[6] === career.teamVsIndividual) {
            career.score += 3;
            career.matchedTraits.push("Collaboration Style");
        } else if (answers[6] && answers[6].includes("solo") && career.traits.includes("focus")) {
            career.score += 1;
        }

        // Evaluate Q8: Career Goal
        if (answers[7] === career.goal) {
            career.score += 3;
            career.matchedTraits.push("Long-term Goals");
        }

        // Evaluate Q9: Academic Intensity
        if (answers[8] === career.academicIntensity) {
            career.score += 2;
        }

        // Evaluate Q10: Risk Tolerance
        if (answers[9] === career.riskTolerance) {
            career.score += 2;
        }

        // Evaluate Q11: Physical Demand
        if (answers[10] === career.physicalDemand) {
            career.score += 2;
        }

        // Evaluate Q12: Social Interaction
        if (answers[11] === career.socialInteraction) {
            career.score += 2;
        }

        // Penalize mismatched conflict if defined
        if (career.conflict && answers[7] === career.conflict) {
            career.score -= 1;
        }
    });

    // Sort by score descending
    scoredCareers.sort((a, b) => b.score - a.score);

    const primaryOption = scoredCareers[0];
    const secondaryOption = scoredCareers[1];

    // Max potential score is ~24-26 depending on partial matches, 
    // let's base it out of around 24 for percentage.
    let compScore = Math.round((primaryOption.score / 24) * 100);
    if (compScore > 98) compScore = 98; // Realistic cap
    if (compScore < 40) compScore = 55 + Math.floor(Math.random() * 10); // fallback

    return {
        career: primaryOption.title, // Keep old `career` field for compatibility in some places, but use primaryCareer structure
        primaryCareer: {
            title: primaryOption.title,
            domain: primaryOption.domain,
            description: `This career is an excellent match because your profile strongly aligns with ${primaryOption.matchedTraits.join(', ')}.`,
            skills: primaryOption.recommendedSkills,
            goalsRoadmap: primaryOption.goalsRoadmap,
            difficulty: primaryOption.difficultyLevel
        },
        secondaryCareer: {
            title: secondaryOption.title,
            domain: secondaryOption.domain,
            description: `A strong alternative path that also utilizes your skills in ${secondaryOption.domain}.`,
            skills: secondaryOption.recommendedSkills,
            goalsRoadmap: secondaryOption.goalsRoadmap,
            difficulty: secondaryOption.difficultyLevel
        },
        compatibilityScore: compScore,
        strengthsMatched: primaryOption.matchedTraits,
        missingSkills: primaryOption.recommendedSkills, // for simplicity
        roadmap: primaryOption.goalsRoadmap,

        // Backwards compatibility for unmodified UI
        description: `This career perfectly reflects your strengths in ${primaryOption.matchedTraits.join(' and ')}.`,
        skills: primaryOption.recommendedSkills,
        goals: primaryOption.goalsRoadmap
    };
};

