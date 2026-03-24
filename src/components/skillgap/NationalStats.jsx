import React from 'react';
import { motion } from 'framer-motion';
import { countCriticalStates, getMostNeededSkill, getMostOpportunityState } from '../../utils/heatmapUtils';
import { IconAlertTriangle, IconTrendingUp, IconStar } from '../Icons';

const NationalStats = ({ category }) => {
  const criticalCount = countCriticalStates(70, category);
  const mostNeeded = getMostNeededSkill(category);
  const opportunityState = getMostOpportunityState(category);

  const stats = [
    {
      icon: <IconAlertTriangle size={22} />,
      value: criticalCount,
      label: 'States in critical shortage',
      color: '#c0392b',
    },
    {
      icon: <IconTrendingUp size={22} />,
      value: mostNeeded,
      label: 'Most needed skill nationally',
      color: '#e67e22',
    },
    {
      icon: <IconStar size={22} />,
      value: opportunityState,
      label: 'Most opportunity state',
      color: '#27ae60',
    },
  ];

  return (
    <div className="sgh-national-stats">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          className="sgh-stat-card brutalist-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <div className="sgh-stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
          <div className="sgh-stat-value" style={{ color: stat.color }}>
            {stat.value}
          </div>
          <div className="sgh-stat-label">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default NationalStats;
