/**
 * Logic for AI Threat Meter
 */

import { getAIThreatAssessment } from './aiService';

/**
 * Parses a LinkedIn URL to attempt to extract a job title or name.
 * @param {string} url - The LinkedIn profile URL.
 * @returns {string} - Extracted hint or null.
 */
export const parseLinkedInHint = (url) => {
    if (!url) return null;
    try {
        const parts = url.split('/in/').filter(Boolean);
        if (parts.length > 1) {
            const profileSlug = parts[1].split('/')[0];
            // Replace hyphens/numbers with spaces for a better guess
            return profileSlug.replace(/[-0-9]+/g, ' ').trim();
        }
    } catch (e) {
        console.warn("Could not parse LinkedIn URL hint", e);
    }
    return null;
};

/**
 * Calculates the final threat profile.
 * @param {string} linkedinUrl 
 * @returns {Promise<Object>}
 */
export const calculateAIThreat = async (linkedinUrl) => {
    const assessment = await getAIThreatAssessment(linkedinUrl);

    // overallScore is on a 0-10 scale from the AI service
    let score = parseFloat(assessment.overallScore) || 0;
    if (score < 0) score = 0;
    if (score > 10) score = 10;

    return {
        ...assessment,
        overallScore: score,
        level: score > 7.5 ? 'Critical' : score > 5 ? 'High' : score > 2.5 ? 'Moderate' : 'Low',
        color: score > 7.5 ? '#ef4444' : score > 5 ? '#f59e0b' : score > 2.5 ? '#3b82f6' : '#10b981'
    };
};
