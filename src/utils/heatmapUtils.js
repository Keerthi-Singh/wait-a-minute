import { stateSkillGaps, topoNameMapping } from '../data/stateSkillGaps';

/**
 * Get severity color using HSL: green (low) → red (high)
 * hsl(120 - severity * 1.2, 70%, 45%)
 */
export const getSeverityColor = (severity) => {
  if (severity === null || severity === undefined) return '#cccccc';
  const hue = Math.max(0, 120 - severity * 1.2);
  return `hsl(${hue}, 70%, 45%)`;
};

/**
 * Calculate average severity for a state, optionally filtered by category
 */
export const getAverageSeverity = (stateName, category = 'all') => {
  const stateData = stateSkillGaps[stateName];
  if (!stateData) return null;

  const gaps = category === 'all'
    ? stateData.skillGaps
    : stateData.skillGaps.filter(g => g.category === category);

  if (gaps.length === 0) return null;
  return gaps.reduce((sum, g) => sum + g.severity, 0) / gaps.length;
};

/**
 * Resolve a TopoJSON geo name to our data key
 */
export const resolveStateName = (geoName) => {
  if (!geoName) return null;
  // Try direct match first
  if (stateSkillGaps[geoName]) return geoName;
  // Try via mapping
  if (topoNameMapping[geoName] !== undefined) return topoNameMapping[geoName];
  // Fuzzy: try trimming
  const trimmed = geoName.trim();
  if (stateSkillGaps[trimmed]) return trimmed;
  return null;
};

/**
 * Get severity label and CSS class name
 */
export const getSeverityBadge = (avgSeverity) => {
  if (avgSeverity > 75) return { label: 'Critical', className: 'badge-critical' };
  if (avgSeverity > 60) return { label: 'High', className: 'badge-high' };
  if (avgSeverity > 40) return { label: 'Moderate', className: 'badge-moderate' };
  return { label: 'Low', className: 'badge-low' };
};

/**
 * Get the worst skill gap for a state (optionally filtered by category)
 */
export const getWorstGap = (stateName, category = 'all') => {
  const stateData = stateSkillGaps[stateName];
  if (!stateData) return null;

  const gaps = category === 'all'
    ? stateData.skillGaps
    : stateData.skillGaps.filter(g => g.category === category);

  if (gaps.length === 0) return null;
  return gaps.reduce((worst, g) => (g.severity > worst.severity ? g : worst), gaps[0]);
};

/**
 * Count states where average severity is above a threshold
 */
export const countCriticalStates = (threshold = 70, category = 'all') => {
  let count = 0;
  Object.keys(stateSkillGaps).forEach(state => {
    const avg = getAverageSeverity(state, category);
    if (avg !== null && avg > threshold) count++;
  });
  return count;
};

/**
 * Get the skill that appears most often as rank-1 gap across all states
 */
export const getMostNeededSkill = (category = 'all') => {
  const freq = {};
  Object.keys(stateSkillGaps).forEach(state => {
    const worst = getWorstGap(state, category);
    if (worst) {
      freq[worst.skill] = (freq[worst.skill] || 0) + 1;
    }
  });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : 'N/A';
};

/**
 * Get the state with the highest employment rate (most opportunity)
 */
export const getMostOpportunityState = (category = 'all') => {
  let best = null;
  let bestScore = -Infinity;
  Object.entries(stateSkillGaps).forEach(([state, data]) => {
    const avg = getAverageSeverity(state, category);
    // Score = employment rate - half the average severity (prefer high employment + low gap)
    const score = data.employmentRate - (avg || 50) * 0.5;
    if (score > bestScore) {
      bestScore = score;
      best = state;
    }
  });
  return best || 'N/A';
};
