import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SkillBar from './SkillBar';
import { stateSkillGaps } from '../../data/stateSkillGaps';
import { getAverageSeverity, getSeverityBadge } from '../../utils/heatmapUtils';
import { IconUsers, IconBuilding, IconTrendingDown, IconTrendingUp, IconMinus } from '../Icons';

const StateSidebar = ({ stateName, onClose, category }) => {
  const navigate = useNavigate();
  const [aiInsight, setAiInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const stateData = stateName ? stateSkillGaps[stateName] : null;

  useEffect(() => {
    if (!stateName || !stateData) return;

    const fetchInsight = async () => {
      setLoadingInsight(true);
      setAiInsight('');
      try {
        // Dynamic import to avoid circular issues
        const { default: Groq } = await import('groq-sdk');
        const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
        if (!API_KEY) throw new Error('No API key');
        
        const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });
        
        const skillList = stateData.skillGaps
          .map(g => `${g.skill} (${g.severity}% severity)`)
          .join(', ');
        const industries = stateData.topIndustries.join(', ');

        const prompt = `You are a career advisor. The state of ${stateName} in India has these top skill gaps: ${skillList}. Its top industries are ${industries} and employment rate is ${stateData.employmentRate}%. In 2-3 sentences, give a specific actionable insight for a student in this state about what to learn and why it matters locally. Be specific to this state's economy.`;

        const response = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 256,
        });

        setAiInsight(response.choices[0].message.content);
      } catch (err) {
        console.error('AI insight error:', err);
        setAiInsight('Insight unavailable — please try again later.');
      }
      setLoadingInsight(false);
    };

    fetchInsight();
  }, [stateName]);

  const handleStartLearning = () => {
    if (stateData) {
      navigate('/analyzer', { state: { prefilledCareer: stateData.topNeededCareer } });
    }
  };

  if (!stateName || !stateData) return null;

  const avgSeverity = getAverageSeverity(stateName, category);
  const badge = getSeverityBadge(avgSeverity);

  const filteredGaps = category === 'all'
    ? stateData.skillGaps
    : stateData.skillGaps.filter(g => g.category === category);

  const trendIcon = stateData.overallTrend === 'worsening' ? <IconTrendingDown size={16} /> : stateData.overallTrend === 'improving' ? <IconTrendingUp size={16} /> : <IconMinus size={16} />;

  return (
    <AnimatePresence>
      {stateName && (
        <>
          {/* Mobile overlay background */}
          <motion.div
            className="sgh-sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="sgh-sidebar"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          >
            {/* Close button */}
            <button className="sgh-sidebar-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Section 1: State Header */}
            <div className="sgh-sidebar-header">
              <h2 className="sgh-state-name">{stateName}</h2>
              <span className={`sgh-severity-badge ${badge.className}`}>{badge.label}</span>
              <div className="sgh-emp-rate">
                <span className="sgh-emp-rate-number">{stateData.employmentRate}%</span>
                <span className="sgh-emp-rate-label">Employment Rate</span>
              </div>
              <div className="sgh-state-chips">
                <div className="sgh-chip">
                  <span className="sgh-chip-icon"><IconUsers size={14} /></span>
                  {stateData.workforce}
                </div>
                <div className="sgh-chip">
                  <span className="sgh-chip-icon"><IconBuilding size={14} /></span>
                  {stateData.topIndustries[0]}
                </div>
                <div className="sgh-chip">
                  <span className="sgh-chip-icon">{trendIcon}</span>
                  {stateData.overallTrend.charAt(0).toUpperCase() + stateData.overallTrend.slice(1)}
                </div>
              </div>
            </div>

            {/* Section 2: Skill Gap Bars */}
            <div className="sgh-sidebar-section">
              <h3 className="sgh-section-title">Top Skill Gaps</h3>
              {filteredGaps.length > 0 ? (
                filteredGaps.map((gap, i) => (
                  <SkillBar
                    key={gap.skill}
                    skill={gap.skill}
                    severity={gap.severity}
                    trend={gap.trend}
                    index={i}
                  />
                ))
              ) : (
                <p className="sgh-no-data">No gaps for this category in {stateName}</p>
              )}
            </div>

            {/* Section 3: AI Insight */}
            <div className="sgh-sidebar-section">
              <div className="sgh-ai-insight-card">
                <div className="sgh-ai-label">
                  <span className="sgh-ai-dot"></span>
                  AI Insight
                </div>
                {loadingInsight ? (
                  <div className="sgh-ai-loading">
                    <div className="sgh-ai-spinner"></div>
                    <span>Generating insight...</span>
                  </div>
                ) : (
                  <p className="sgh-ai-text">{aiInsight}</p>
                )}
              </div>
            </div>

            {/* Section 4: CTA */}
            <motion.button
              className="sgh-cta-btn"
              onClick={handleStartLearning}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Learning {stateData.topNeededCareer} →
            </motion.button>

            <p className="sgh-data-ref">Source: {stateData.nsdc_ref}</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StateSidebar;
