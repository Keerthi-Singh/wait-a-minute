import React from 'react';
import { motion } from 'framer-motion';
import { IconCrosshair, IconMonitor, IconBarChart, IconPlusSquare } from '../Icons';

const categories = [
  { key: 'all', label: 'All Skills', icon: <IconCrosshair size={16} /> },
  { key: 'tech', label: 'Tech', icon: <IconMonitor size={16} /> },
  { key: 'business', label: 'Business', icon: <IconBarChart size={16} /> },
  { key: 'healthcare', label: 'Healthcare', icon: <IconPlusSquare size={16} /> },
];

const CategoryFilter = ({ activeCategory, onChange }) => {
  return (
    <div className="sgh-category-filter">
      {categories.map(cat => (
        <motion.button
          key={cat.key}
          className={`sgh-cat-btn ${activeCategory === cat.key ? 'active' : ''}`}
          onClick={() => onChange(cat.key)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="sgh-cat-icon">{cat.icon}</span>
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
