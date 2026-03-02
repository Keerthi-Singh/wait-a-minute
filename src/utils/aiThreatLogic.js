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

    // Normalize score
    let score = assessment.threatScore;
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    return {
        ...assessment,
        threatScore: score,
        level: score > 75 ? 'Critical' : score > 50 ? 'High' : score > 25 ? 'Moderate' : 'Low',
        color: score > 75 ? '#ef4444' : score > 50 ? '#f59e0b' : score > 25 ? '#3b82f6' : '#10b981'
    };
};
