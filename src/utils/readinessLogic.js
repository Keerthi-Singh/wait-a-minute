import { intelligenceCareers } from '../data/intelligenceCareers';

export const calculateReadiness = (inputs) => {
    const { targetCareerId, currentSkills, effortTolerance, timeAvailability, financialPressure, stabilityNeeds } = inputs;
    const career = intelligenceCareers.find(c => c.id === targetCareerId);

    if (!career) return null;

    let score = 0;

    // 1. Skill Match (30%)
    let skillMatch = 0;
    const requiredTraits = career.traits.map(t => t.toLowerCase());
    const userTraits = currentSkills.map(t => t.toLowerCase());
    const matchedTraits = requiredTraits.filter(t => userTraits.includes(t));

    const missingSkills = requiredTraits.filter(t => !userTraits.includes(t));
    if (requiredTraits.length > 0) {
        skillMatch = (matchedTraits.length / requiredTraits.length) * 100;
    } else {
        skillMatch = 100;
    }
    score += skillMatch * 0.3;

    // 2. Effort Alignment (20%)
    let effortAlignment = 0;
    const effortMap = { 'Low': 1, 'Medium': 2, 'High': 3, 'Extreme': 4 };
    const requiredEffort = effortMap[career.effortRequired] || 2;
    const userEffort = effortMap[effortTolerance] || 2;

    if (userEffort >= requiredEffort) effortAlignment = 100;
    else if (userEffort === requiredEffort - 1) effortAlignment = 60;
    else if (userEffort === requiredEffort - 2) effortAlignment = 30;
    else effortAlignment = 0;
    score += effortAlignment * 0.2;

    // 3. Time Commitment Fit (20%)
    let timeFit = 0;
    const timeMatch = career.timeToStability.match(/\d+/g);
    let neededYears = timeMatch ? Math.max(...timeMatch.map(Number)) : 5;

    let userYears = 0;
    if (timeAvailability.includes('1-2')) userYears = 2;
    else if (timeAvailability.includes('3-5')) userYears = 5;
    else if (timeAvailability.includes('5+')) userYears = 10;

    if (userYears >= neededYears) timeFit = 100;
    else if (userYears >= neededYears - 2) timeFit = 70;
    else if (userYears >= neededYears - 4) timeFit = 40;
    else timeFit = 10;

    // Financial pressure impact on Time Fit
    if (financialPressure.includes('High') && neededYears > 3) {
        timeFit -= 30;
    } else if (financialPressure.includes('Low')) {
        timeFit += 20;
    }
    timeFit = Math.max(0, Math.min(100, timeFit));
    score += timeFit * 0.2;

    // 4. Practical Feasibility / Stability (30%)
    let feasibility = 0;
    const stabilityMap = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
    const requiredStability = stabilityMap[career.stability] || 3;
    let userStabilityNeeds = 3;
    if (stabilityNeeds.includes('Low Risk')) userStabilityNeeds = 5;
    else if (stabilityNeeds.includes('Moderate')) userStabilityNeeds = 3;
    else if (stabilityNeeds.includes('High Risk')) userStabilityNeeds = 1;

    if (userStabilityNeeds > requiredStability) {
        feasibility = 100 - ((userStabilityNeeds - requiredStability) * 20);
    } else {
        feasibility = 100;
    }

    if (career.riskLevel === 'Very High' && stabilityNeeds.includes('Low Risk')) feasibility -= 30;
    if (career.realityCheck.toLowerCase().includes('low')) feasibility -= 20;

    feasibility = Math.max(0, Math.min(100, feasibility));
    score += feasibility * 0.3;
    score = Math.round(score);

    // Burnout Risk check
    let practicalBurnoutRisk = career.burnoutRisk;
    if (effortAlignment < 60 && requiredEffort >= 3) {
        practicalBurnoutRisk = 'Extreme (Underprepared Effort)';
    }

    let insight = '';
    let improvementPath = [];
    if (score >= 80) {
        insight = `Ready Now! You have a high alignment with ${career.title}.`;
        improvementPath.push('Begin looking for entry-level roles or immediate certifications.');
    } else if (score >= 50) {
        insight = `Needs Preparation. You have gaps to fill before fully committing to ${career.title}.`;
        improvementPath.push('Work on matching the effort required.');
    } else {
        insight = `High Risk Path. Your current situation and traits heavily misalign with ${career.title}.`;
        improvementPath.push('Re-evaluate time commitment and financial pressure.');
        improvementPath.push('Consider backup paths offering more stability.');
    }

    if (missingSkills.length > 0) {
        improvementPath.push(`Actively develop: ${missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}.`);
    }

    return {
        career,
        readinessScore: score,
        breakdown: {
            skillMatch: Math.round(skillMatch),
            effortAlignment: Math.round(effortAlignment),
            timeFit: Math.round(timeFit),
            feasibility: Math.round(feasibility)
        },
        missingSkills: missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        burnoutRisk: practicalBurnoutRisk,
        insight,
        improvementPath,
        backupPaths: career.backupPaths
    };
};
