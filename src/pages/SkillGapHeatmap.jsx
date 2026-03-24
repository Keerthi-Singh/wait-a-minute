import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import IndiaMap from '../components/skillgap/IndiaMap';
import StateSidebar from '../components/skillgap/StateSidebar';
import NationalStats from '../components/skillgap/NationalStats';
import CategoryFilter from '../components/skillgap/CategoryFilter';
import MapLegend from '../components/skillgap/MapLegend';
import { incrementStat, db } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { IconBookOpen, IconBriefcase, IconScale } from '../components/Icons';
import './SkillGapHeatmap.css';

const SkillGapHeatmap = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedState, setSelectedState] = useState(null);

  // Log page view once
  useEffect(() => {
    incrementStat('heatmapViews');
  }, []);

  const handleStateClick = async (stateName) => {
    setSelectedState(stateName);

    // Log click to Firestore
    try {
      const { stateSkillGaps } = await import('../data/stateSkillGaps');
      const data = stateSkillGaps[stateName];
      await addDoc(collection(db, 'stateClicks'), {
        stateName,
        timestamp: serverTimestamp(),
        topNeededCareer: data?.topNeededCareer || 'Unknown',
      });
    } catch (err) {
      console.warn('Could not log state click:', err);
    }
  };

  const handleCloseSidebar = () => {
    setSelectedState(null);
  };

  return (
    <motion.div
      className="sgh-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Header */}
      <motion.div
        className="sgh-hero"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <div className="sgh-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          National Skill Intelligence
        </div>
        <h1 className="sgh-title">India Skill Gap Heatmap</h1>
        <p className="sgh-subtitle">
          Explore real-time skill shortages across every Indian state. Click any state to discover what skills are missing and start building them.
        </p>
      </motion.div>

      {/* National Stats */}
      <NationalStats category={activeCategory} />

      {/* Category Filters */}
      <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />

      {/* Map + Sidebar Layout */}
      <div className={`sgh-main-area ${selectedState ? 'sidebar-open' : ''}`}>
        <motion.div
          className="sgh-map-wrapper"
          layout
          transition={{ duration: 0.3 }}
        >
          <IndiaMap
            category={activeCategory}
            onStateClick={handleStateClick}
            selectedState={selectedState}
          />
          <MapLegend />
        </motion.div>

        <StateSidebar
          stateName={selectedState}
          onClose={handleCloseSidebar}
          category={activeCategory}
        />
      </div>

      {/* SDG Badges */}
      <motion.div
        className="sgh-sdg-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="sgh-sdg-badge">
          <span className="sgh-sdg-icon"><IconBookOpen size={20} /></span>
          <div>
            <strong>SDG 4</strong>
            <span>Quality Education</span>
          </div>
        </div>
        <div className="sgh-sdg-badge">
          <span className="sgh-sdg-icon"><IconBriefcase size={20} /></span>
          <div>
            <strong>SDG 8</strong>
            <span>Decent Work</span>
          </div>
        </div>
        <div className="sgh-sdg-badge">
          <span className="sgh-sdg-icon"><IconScale size={20} /></span>
          <div>
            <strong>SDG 10</strong>
            <span>Reduced Inequalities</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SkillGapHeatmap;
