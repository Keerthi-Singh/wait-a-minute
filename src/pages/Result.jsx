import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import JobDiscovery from '../components/JobDiscovery';
import './Result.css';

const Result = () => {
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedResult = localStorage.getItem('careerResult');
        if (savedResult) {
            setResult(JSON.parse(savedResult));
        } else {
            navigate('/analyzer');
        }
    }, [navigate]);

    if (!result) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            className="result-page"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="result-container">
                <motion.div className="result-header" variants={itemVariants}>
                    <span className="badge">AI-Powered Career Intelligence</span>
                    <h1 className="career-title">{result.career}</h1>
                    <p className="career-description">{result.description}</p>
                </motion.div>

                <div className="result-grid">
                    <motion.section className="skills-section" variants={itemVariants}>
                        <h3 className="section-title">Core Skills to Master</h3>
                        <div className="skills-grid">
                            {result.skills.map((skill, index) => (
                                <div key={index} className="skill-card">
                                    <div className="skill-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                        </svg>
                                    </div>
                                    <span>{skill}</span>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    <motion.section className="goals-section" variants={itemVariants}>
                        <h3 className="section-title">Your Roadmap</h3>
                        <div className="timeline">
                            {result.goals.map((goal, index) => (
                                <div key={index} className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <span className="goal-tag">Phase {index + 1}</span>
                                        <p>{goal}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                </div>

                <JobDiscovery careerTitle={result.career} />

                <motion.div className="result-actions" variants={itemVariants}>
                    <button className="retake-btn" onClick={() => navigate('/analyzer')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <polyline points="1 4 1 10 7 10" />
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                        </svg>
                        Retake Assessment
                    </button>
                    <button className="share-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download Roadmap
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Result;
