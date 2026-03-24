import React from 'react';
import { motion } from 'framer-motion';

const SkillBar = ({ skill, severity, trend, index }) => {
  const getBarColor = (sev) => {
    if (sev > 75) return '#c0392b';
    if (sev >= 50) return '#e67e22';
    return '#27ae60';
  };

  const getTrendBadge = (t) => {
    if (t === 'worsening') return { icon: '↑', label: 'Worsening', className: 'trend-worsening' };
    if (t === 'improving') return { icon: '↓', label: 'Improving', className: 'trend-improving' };
    return { icon: '—', label: 'Stable', className: 'trend-stable' };
  };

  const barColor = getBarColor(severity);
  const trendBadge = getTrendBadge(trend);

  return (
    <motion.div
      className="sgh-skill-bar"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
    >
      <div className="sgh-skill-bar-header">
        <span className="sgh-skill-name">{skill}</span>
        <div className="sgh-skill-meta">
          <span className={`sgh-trend-badge ${trendBadge.className}`}>
            {trendBadge.icon} {trendBadge.label}
          </span>
          <span className="sgh-skill-severity" style={{ color: barColor }}>
            {severity}%
          </span>
        </div>
      </div>
      <div className="sgh-bar-track">
        <motion.div
          className="sgh-bar-fill"
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${severity}%` }}
          transition={{ delay: index * 0.08 + 0.15, duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

export default SkillBar;
