import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="hero-section"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      >
        <div className="badge">AI-Powered Guidance</div>
        <h1 className="hero-title">
          Career Path <span className="gradient-text">Analyzer</span>
        </h1>
        <p className="hero-description">
          Unlock your professional potential. Our advanced AI analyzes your skills,
          interests, and goals to map out the perfect career trajectory for your future.
        </p>
        <motion.button
          className="cta-button"
          onClick={() => navigate('/analyzer')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </motion.button>
      </motion.div>

      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
    </motion.div>
  );
};

export default Home;
