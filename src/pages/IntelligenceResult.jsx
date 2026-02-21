import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { generateActionPath } from '../utils/actionPathLogic';
import './IntelligenceResult.css';

export default function IntelligenceResult() {
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('intelligenceResult');
        if (stored) setResult(JSON.parse(stored));
        else navigate('/intelligence-lab');
    }, [navigate]);

    if (!result) return null;

    const {
        topCareer, backupPaths, timeToStability, realityCheck,
        passionVsPracticality, burnoutRisk, lifeSimulation, confidenceScore
    } = result;

    const actionPath = generateActionPath(topCareer);

    const vContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
    const vItem = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <motion.div className="intel-res-page" variants={vContainer} initial="hidden" animate="visible">
            <div className="intel-res-container">
                <motion.div variants={vItem} className="intel-res-header">
                    <span className="premium-badge">Deep Career Intelligence Analysis</span>
                    <h1>{topCareer.title}</h1>
                    <div className="confidence-pill">
                        <strong>{confidenceScore}%</strong> Decision Confidence
                    </div>
                </motion.div>

                <div className="intel-res-grid">
                    {/* Left Column */}
                    <motion.div className="intel-col" variants={vItem}>
                        <div className="intel-card match-card">
                            <h3>Executive Summary</h3>
                            <ul className="intel-traits-list">
                                <li><strong>Domain:</strong> {topCareer.domain}</li>
                                <li><strong>Required Traits:</strong> {topCareer.traits.join(', ')}</li>
                                <li><strong>Time to Stability:</strong> {timeToStability}</li>
                                <li><strong>Base Stability:</strong> {topCareer.stability}</li>
                                <li><strong>Risk Level:</strong> {topCareer.riskLevel}</li>
                                <li><strong>Effort Required:</strong> {topCareer.effortRequired}</li>
                            </ul>
                        </div>

                        <div className="intel-card backups-card">
                            <h3>Backup / Pivoting Paths</h3>
                            <div className="backup-list">
                                {backupPaths.map((bp, idx) => (
                                    <div key={idx} className="backup-item">
                                        <div className="backup-dot" />
                                        <span>{bp}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="intel-card metrics-card">
                            <h3>Reality & Risk Check</h3>
                            <div className="metric-row">
                                <span>Reality Feasibility:</span>
                                <strong className={`val-${realityCheck.split(' ')[0].toLowerCase()}`}>{realityCheck}</strong>
                            </div>
                            <div className="metric-row">
                                <span>Burnout Risk:</span>
                                <strong className={`val-${burnoutRisk.split(' ')[0].toLowerCase()}`}>{burnoutRisk}</strong>
                            </div>
                            <div className="metric-row">
                                <span>Balance Outlook:</span>
                                <strong className="val-text">{passionVsPracticality}</strong>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <motion.div className="intel-col" variants={vItem}>
                        <div className="intel-card sim-card">
                            <h3>5-Year Life Simulation Indicator</h3>
                            <div className="sim-timeline">
                                {lifeSimulation.map((step, idx) => (
                                    <div key={idx} className="sim-step">
                                        <div className="sim-marker">{idx + 1}</div>
                                        <div className="sim-content">{step}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="intel-card scores-card">
                            <h3>Score Analysis</h3>
                            <div className="score-bars">
                                <div className="score-group">
                                    <label>Passion Alignment</label>
                                    <div className="bar-bg"><div className="bar-fill passion" style={{ width: `${Math.min(100, (topCareer.passionScore / 60) * 100)}%` }}></div></div>
                                </div>
                                <div className="score-group">
                                    <label>Practicality & Skill Alignment</label>
                                    <div className="bar-bg"><div className="bar-fill practical" style={{ width: `${Math.min(100, (topCareer.practicalityScore / 60) * 100)}%` }}></div></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- NEW SECTION: CAREER ACTION PATH --- */}
                <motion.div variants={vItem} className="action-path-section">
                    <div className="action-path-header">
                        <h2>Your Career Action Path</h2>
                        <p>What to do next after choosing this career</p>
                    </div>

                    <div className="action-path-grid">
                        {/* Roadmap */}
                        <div className="intel-card roadmap-card">
                            <h3>Career Path Roadmap</h3>
                            <div className="roadmap-timeline">
                                {actionPath.roadmap.map((rm, idx) => (
                                    <div key={idx} className="roadmap-step">
                                        <div className="roadmap-marker"></div>
                                        <div className="roadmap-content">
                                            <h4>{rm.phase}</h4>
                                            <p>{rm.action}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="action-path-col">
                            {/* Skills */}
                            <div className="intel-card skills-card">
                                <h3>Relevant Skills to Build</h3>
                                <div className="skill-group">
                                    <h4>Core Skills</h4>
                                    <div className="skill-tags">
                                        {actionPath.skills.core.map((s, i) => <span key={i} className="skill-tag core">{s}</span>)}
                                    </div>
                                </div>
                                <div className="skill-group">
                                    <h4>Supporting Skills</h4>
                                    <div className="skill-tags">
                                        {actionPath.skills.supporting.map((s, i) => <span key={i} className="skill-tag support">{s}</span>)}
                                    </div>
                                </div>
                                <div className="skill-group">
                                    <h4>Bonus Differentiator Skills</h4>
                                    <div className="skill-tags">
                                        {actionPath.skills.bonus.map((s, i) => <span key={i} className="skill-tag bonus">{s}</span>)}
                                    </div>
                                </div>
                            </div>

                            {/* Certifications */}
                            <div className="intel-card certs-card">
                                <h3>Recommended Certifications</h3>
                                <ul className="cert-list">
                                    {actionPath.certifications.map((c, i) => (
                                        <li key={i}>{c}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Jobs */}
                            <div className="intel-card jobs-card">
                                <h3>Explore Opportunities</h3>
                                <div className="job-buttons">
                                    <a href={`https://www.google.com/search?q=${encodeURIComponent(topCareer.title + " jobs")}&ibp=htl;jobs`} target="_blank" rel="noopener noreferrer" className="job-btn google-job">
                                        View Jobs on Google
                                    </a>
                                    <a href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(topCareer.title)}`} target="_blank" rel="noopener noreferrer" className="job-btn linkedin-job">
                                        View Jobs on LinkedIn
                                    </a>
                                    <a href={`https://www.indeed.com/jobs?q=${encodeURIComponent(topCareer.title)}`} target="_blank" rel="noopener noreferrer" className="job-btn indeed-job">
                                        View Jobs on Indeed
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div className="intel-actions" variants={vItem}>
                    <button className="secondary-btn" onClick={() => navigate('/intelligence-lab')}>Recalculate Analysis</button>
                    <button className="primary-intel" onClick={() => navigate('/analyzer')}>Back to Basic Analyzer</button>
                </motion.div>
            </div>
        </motion.div>
    );
}
