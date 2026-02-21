import { intelligenceCareers } from '../data/intelligenceCareers';

export const analyzeDeepIntelligence = (answers) => {
    // 1) Evaluate user profile from detailed answers.
    // Assuming answers shape:
    // {
    //   style: string,           (structured vs creative)
    //   focus: string,           (problem vs ideas vs people)
    //   domains: ['Technology', 'Creative Arts, Film & Media', ...], (Array)
    //   otherDomain: string,     (custom text)
    //   lifestyle: string,       (stability vs risk, variable income etc)
    //   effortTolerance: string, (5-10 yrs vs quick entry, competitive exams)
    //   environments: ['Office', 'Creative studio', ...], (Array)
    //   strengths: ['Communication', 'Logic', ...] (Top rated)
    // }

    // Init scores
    let scoredCareers = intelligenceCareers.map(c => ({
        ...c,
        passionScore: 0,
        practicalityScore: 0,
        totalScore: 0
    }));

    scoredCareers.forEach(c => {
        // Evaluate Domains (Passion)
        if (answers.domains?.includes(c.domain)) {
            c.passionScore += 30;
        }

        // Evaluate Styles vs Traits
        const hasLogic = c.traits.some(t => t.toLowerCase() === 'logic' || t.toLowerCase() === 'focus');
        const hasCreative = c.traits.some(t => t.toLowerCase() === 'creativity');
        const hasEmpathy = c.traits.some(t => t.toLowerCase() === 'empathy');
        const hasDiscipline = c.traits.some(t => t.toLowerCase() === 'discipline');

        if (answers.style?.includes('creative') && hasCreative) {
            c.passionScore += 10;
        } else if (answers.style?.includes('structured') && hasLogic) {
            c.practicalityScore += 10;
        }

        if (answers.focus === 'logic' && hasLogic) c.passionScore += 10;
        if (answers.focus === 'creative' && hasCreative) c.passionScore += 10;
        if (answers.focus === 'people' && hasEmpathy) c.passionScore += 10;

        // Evaluate Strengths (Skill Match -> Practicality)
        if (answers.strengths) {
            const lowerStrengths = answers.strengths.map(s => s.toLowerCase());
            let strengthMatches = c.traits.filter(t => lowerStrengths.includes(t.toLowerCase())).length;
            c.practicalityScore += (strengthMatches * 10);
        }

        // Evaluate Lifestyle vs Risk/Stability Preference
        const prefersStability = answers.lifestyle?.includes('stability') || answers.lifestyle?.includes('fixed income');
        const prefersRisk = answers.lifestyle?.includes('risk') || answers.lifestyle?.includes('reward');

        if (prefersStability && (c.stability === 'High' || c.stability === 'Very High')) {
            c.practicalityScore += 15;
            if (c.riskLevel === 'Low') c.practicalityScore += 10;
        }
        if (prefersRisk && (c.stability === 'Low' || c.stability === 'Very Low')) {
            c.passionScore += 10; // Entrepreneurs etc are passion-driven despite low stability
        }

        // Evaluate Effort Tolerance
        const isExamHeavy = c.studyDuration.toLowerCase().includes('exam') || c.studyDuration.toLowerCase().includes('8-12');
        if (answers.effortTolerance?.includes('5-10 years') || answers.effortTolerance?.includes('exams')) {
            // Can handle it
            if (isExamHeavy) c.practicalityScore += 10;
        } else if (answers.effortTolerance?.includes('quick entry')) {
            if (isExamHeavy) c.practicalityScore -= 20; // major penalty
            else c.practicalityScore += 10;
        }

        // Total score synthesis
        c.totalScore = c.passionScore + c.practicalityScore;
    });

    // Sort by total score
    scoredCareers.sort((a, b) => b.totalScore - a.totalScore);

    // Safety check - If no strong match, just use top sort
    const bestMatch = scoredCareers[0];
    const secondaryMatch = scoredCareers[1];
    const tertiaryMatch = scoredCareers[2];

    // Calculate Passion vs Practicality ratio for the best match
    const pvPStatus = (bestMatch.passionScore > bestMatch.practicalityScore)
        ? 'Passion-Driven (Higher Risk)'
        : (bestMatch.passionScore === bestMatch.practicalityScore) ? 'Perfectly Balanced' : 'Highly Practical / Safe';

    // Build timeline simulation
    const timeline = [];
    if (bestMatch.timeToStability.includes('10')) {
        timeline.push('Years 1-4: Intense Education / Base Building');
        timeline.push('Years 5-7: Entry Level Grind / Specialization / Exams');
        timeline.push('Years 8-10: Breakthrough & Establishing Stability');
    } else if (bestMatch.studyDuration.includes('Exam') || bestMatch.title.includes('IAS')) {
        timeline.push('Years 1-3: Relentless Exam Preparation & Attempts');
        timeline.push('Years 4-5: Academy Training / Probation / Backup pivoting');
        timeline.push('Years 5+: Posting and Rapid Growth in Power/Stability');
    } else {
        timeline.push('Years 1-3: Skill Acquisition & Portfolio/Degree Completion');
        timeline.push('Years 3-5: Breaking into Industry & Network Building');
        timeline.push('Years 5+: Rapid Career Progression & Income Scaling');
    }

    let confidence = 50 + Math.min(bestMatch.practicalityScore, 48); // cap around 98%

    return {
        topCareer: bestMatch,
        backupPaths: [secondaryMatch.title, tertiaryMatch.title, ...bestMatch.backupPaths].slice(0, 3),
        timeToStability: bestMatch.timeToStability,
        realityCheck: bestMatch.realityCheck,
        passionVsPracticality: pvPStatus,
        burnoutRisk: bestMatch.burnoutRisk,
        lifeSimulation: timeline,
        confidenceScore: confidence,
        domainInsights: answers.domains
    };
};
