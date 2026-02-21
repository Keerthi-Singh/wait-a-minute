import { intelligenceCareers } from '../data/intelligenceCareers';

export const calculateReadiness = (inputs) => {
    const {
        targetCareerId,
        careerStage = 'Student',
        experienceTypes = [],
        skillDepth = 'Beginner',
        currentSkills,
        effortTolerance,
        timeAvailability,
        financialPressure,
        stabilityNeeds
    } = inputs;

    const career = intelligenceCareers.find(c => c.id === targetCareerId);

    if (!career) return null;

    let score = 0;

    // --- 1. Maturity & Stage Logic ---
    let maturityLevel = { level: 0, title: 'Curious Beginner' };
    if (careerStage === 'Working (Entry level)') maturityLevel = { level: 4, title: 'Growth Professional' };
    else if (careerStage === 'Freelancing' || careerStage === 'Internship Done') maturityLevel = { level: 3, title: 'Industry Ready' };
    else if (careerStage === 'Doing Projects' || careerStage === 'Switching Career') maturityLevel = { level: 2, title: 'Emerging Practitioner' };
    else if (careerStage === 'Learning Skills') maturityLevel = { level: 1, title: 'Skill Builder' };

    if (skillDepth === 'Advanced' && experienceTypes.includes('Job Experience')) {
        maturityLevel = { level: 4, title: 'Growth Professional' };
    }

    let roleReadiness = [];
    if (maturityLevel.level >= 3) {
        roleReadiness.push({ role: 'Mid-Level', ready: skillDepth === 'Advanced' });
        roleReadiness.push({ role: 'Entry Level', ready: true });
        roleReadiness.push({ role: 'Internship', ready: true });
    } else if (maturityLevel.level === 2) {
        roleReadiness.push({ role: 'Mid-Level', ready: false });
        roleReadiness.push({ role: 'Entry Level', ready: skillDepth === 'Advanced' || experienceTypes.length >= 2 });
        roleReadiness.push({ role: 'Internship', ready: true });
    } else if (maturityLevel.level === 1) {
        roleReadiness.push({ role: 'Entry Level', ready: false });
        roleReadiness.push({ role: 'Internship', ready: skillDepth === 'Intermediate' });
        roleReadiness.push({ role: 'Learning Roles', ready: true });
    } else {
        roleReadiness.push({ role: 'Internship', ready: false });
        roleReadiness.push({ role: 'Learning Roles', ready: true });
    }

    let domainType = 'general';
    if (['Creative Arts, Film & Media'].includes(career.domain)) domainType = 'creative';
    if (['Government & Civil Services', 'Defense & Police', 'Law & Judiciary'].includes(career.domain)) domainType = 'govt';

    let careerStageInsight = '';
    if (domainType === 'govt') {
        if (maturityLevel.level === 0) careerStageInsight = 'Pre-Foundation Stage';
        else if (maturityLevel.level === 1) careerStageInsight = 'Early Preparation Stage';
        else if (maturityLevel.level === 2) careerStageInsight = 'Intense Preparation / Mock Exams';
        else if (maturityLevel.level === 3) careerStageInsight = 'Final Attempt / Interview Ready';
        else careerStageInsight = 'Selected / Posting Waitlist';
    } else if (domainType === 'creative') {
        if (maturityLevel.level === 0) careerStageInsight = 'Exploration Stage';
        else if (maturityLevel.level === 1) careerStageInsight = 'Skill Acquisition Stage';
        else if (maturityLevel.level === 2) careerStageInsight = 'Portfolio Development Stage';
        else if (maturityLevel.level === 3) careerStageInsight = 'Pitch / Commissioning Stage';
        else careerStageInsight = 'Professional Production Stage';
    } else {
        if (maturityLevel.level === 0) careerStageInsight = 'Curiosity / Basics Stage';
        else if (maturityLevel.level === 1) careerStageInsight = 'Skill Acquisition Stage';
        else if (maturityLevel.level === 2) careerStageInsight = 'Project Building Stage';
        else if (maturityLevel.level === 3) careerStageInsight = 'Industry Entry Stage';
        else careerStageInsight = 'Professional Growth Stage';
    }

    // --- 2. Base Readiness Logic ---
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

    // Apply depth modifier to skill match
    if (skillDepth === 'Beginner') skillMatch *= 0.6;
    else if (skillDepth === 'Intermediate') skillMatch *= 0.85;

    score += skillMatch * 0.3;

    let effortAlignment = 0;
    const effortMap = { 'Low': 1, 'Medium': 2, 'High': 3, 'Extreme': 4 };
    const requiredEffort = effortMap[career.effortRequired] || 2;
    const userEffort = effortMap[effortTolerance] || 2;

    if (userEffort >= requiredEffort) effortAlignment = 100;
    else if (userEffort === requiredEffort - 1) effortAlignment = 60;
    else if (userEffort === requiredEffort - 2) effortAlignment = 30;
    else effortAlignment = 0;
    score += effortAlignment * 0.2;

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

    if (financialPressure.includes('High') && neededYears > 3) {
        timeFit -= 30;
    } else if (financialPressure.includes('Low')) {
        timeFit += 20;
    }
    timeFit = Math.max(0, Math.min(100, timeFit));
    score += timeFit * 0.2;

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

    // --- 3. Insights and Adjustments ---
    let practicalBurnoutRisk = career.burnoutRisk;
    if (effortAlignment < 60 && requiredEffort >= 3) {
        practicalBurnoutRisk = 'Extreme (Underprepared Effort)';
    }

    let insight = '';
    let improvementPath = [];

    if (score >= 80) {
        insight = `Ready Now! Highly aligned with ${career.title}.`;
        if (maturityLevel.level < 2) {
            insight += ` But you need more direct experience.`;
            improvementPath.push('Start gathering practical experience (projects or internships).');
        } else {
            improvementPath.push('Begin looking for your target roles immediately.');
        }
    } else if (score >= 50) {
        insight = `Needs Preparation. Solid base but critical gaps for ${career.title}.`;
        improvementPath.push('Work on matching the effort required.');
        if (maturityLevel.level === 0) {
            improvementPath.push('Commit to foundational training / education first.');
        }
    } else {
        insight = `High Risk Path. Situation heavily misaligns with ${career.title}.`;
        improvementPath.push('Re-evaluate time commitment and financial pressure.');
        improvementPath.push('Consider backup paths offering more stability.');
    }

    if (missingSkills.length > 0) {
        improvementPath.push(`Actively develop: ${missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}.`);
    }

    // Role-specific/Gap stage advice
    let gapStageAdvice = '';
    if (maturityLevel.level === 1 && !experienceTypes.includes('Projects')) {
        gapStageAdvice = 'You are ready to start projects but lack practical implementation.';
        improvementPath.push(gapStageAdvice);
    } else if (maturityLevel.level === 2 && !experienceTypes.includes('Internships') && !experienceTypes.includes('Job Experience')) {
        gapStageAdvice = 'You are ready for internships but lack formal industry exposure.';
        improvementPath.push(gapStageAdvice);
    }

    // Career Ladder
    let ladder = [];
    if (domainType === 'govt') {
        ladder = ['Aspirant', 'Trainee / Probationer', 'Officer', 'Senior Grade'];
    } else if (domainType === 'creative') {
        ladder = ['Assistant / Apprentice', 'Junior / Freelancer', 'Established Professional', 'Lead / Director'];
    } else {
        ladder = ['Intern', 'Junior', 'Mid-Level', 'Senior / Lead'];
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
        maturity: {
            level: maturityLevel.level,
            title: maturityLevel.title,
            insight: careerStageInsight,
            roleReadiness,
            ladder
        },
        missingSkills: missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        burnoutRisk: practicalBurnoutRisk,
        insight,
        improvementPath,
        backupPaths: career.backupPaths
    };
};
