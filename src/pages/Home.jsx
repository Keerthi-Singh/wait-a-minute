import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';
import { useAuth } from '../contexts/AuthContext';
import { IconSparkles, IconMapPin, IconShield, IconSearch, IconFileText, IconCpu } from '../components/Icons';

const Home = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const isGuest = !role;

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
        <div className="badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {role === 'admin' ? 'Admin Controller Node' : 'AI-Powered Career Intelligence'}
        </div>

        <h1 className="hero-title">
          Wait a Minute
        </h1>
        <p className="hero-tagline">Your AI-powered career companion</p>
        <p className="hero-description">
          {role === 'admin'
            ? 'Access the master intelligence console to manage career datasets, skill weights, and system logic.'
            : 'Stop the guesswork. Our advanced AI deep-scans your personality, skills, and market trends to build your roadmap to success.'}
        </p>

        <div className="hero-actions">
          {role === 'admin' ? (
            <motion.button
              className="cta-button"
              onClick={() => navigate('/admin-dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Open Admin Console
            </motion.button>
          ) : (
            <div className="hero-actions-container">
              <div className="main-actions">
                <motion.button
                  className="cta-button"
                  onClick={() => navigate('/analyzer')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Analysis
                </motion.button>
                <motion.button
                  className="cta-button cta-outline"
                  onClick={() => navigate('/resume/form')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Build Resume
                </motion.button>
              </div>
              <p className="trial-text">Access advanced career intelligence tools at your fingertips.</p>
            </div>
          )}
        </div>
      </motion.div>

      <section className="features-overview">
        <div className="feature-card brutalist-card featured-card" onClick={() => navigate('/skill-gap-heatmap')} style={{ cursor: 'pointer' }}>
          <div className="featured-badge-tag"><IconSparkles size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> New Feature</div>
          <div className="feature-icon"><IconMapPin size={28} /></div>
          <h3>India Skill Gap Heatmap</h3>
          <p>Explore real-time skill shortages across every Indian state and discover what to learn based on where you live. Powered by NSDC and NITI Aayog data.</p>
        </div>
        <div className="feature-card brutalist-card" onClick={() => navigate('/ai-threat-index')} style={{ cursor: 'pointer' }}>
          <div className="feature-icon"><IconShield size={28} /></div>
          <h3>Will AI Take Your Job?</h3>
          <p>Drop your LinkedIn profile and it will analyze and score the threat of AI taking your job.</p>
        </div>
        <div className="feature-card brutalist-card" onClick={() => navigate('/analyzer')} style={{ cursor: 'pointer' }}>
          <div className="feature-icon"><IconSearch size={28} /></div>
          <h3>Career Analyzer</h3>
          <p>Advanced engine to find your perfect job match.</p>
        </div>
        <div className="feature-card brutalist-card" onClick={() => navigate('/resume/form')} style={{ cursor: 'pointer' }}>
          <div className="feature-icon"><IconFileText size={28} /></div>
          <h3>Resume Builder</h3>
          <p>Professional ATS-friendly templates designed by experts.</p>
        </div>
        <div className="feature-card brutalist-card" onClick={() => navigate('/intelligence-lab')} style={{ cursor: 'pointer' }}>
          <div className="feature-icon"><IconCpu size={28} /></div>
          <h3>Intelligence Lab</h3>
          <p>Deep personality mapping and life simulations.</p>
        </div>
      </section>

      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
    </motion.div>
  );
};

export default Home;
