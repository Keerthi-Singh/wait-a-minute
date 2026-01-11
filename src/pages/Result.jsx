import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
                    <span className="badge">Your Ideal Career Path</span>
                    <h1 className="career-title">{result.career}</h1>
                    <p className="career-description">{result.description}</p>
                </motion.div>

                <div className="result-grid">
                    <motion.section className="skills-section" variants={itemVariants}>
                        <h3 className="section-title">Core Skills to Master</h3>
                        <div className="skills-grid">
                            {result.skills.map((skill, index) => (
                                <div key={index} className="skill-card">
                                    <div className="skill-icon">⚡</div>
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

                <motion.div className="result-actions" variants={itemVariants}>
                    <button className="retake-btn" onClick={() => navigate('/analyzer')}>
                        Retake Assessment
                    </button>
                    <button className="share-btn">Download Roadmap</button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Result;
