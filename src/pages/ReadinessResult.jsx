import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './ReadinessResult.css';

export default function ReadinessResult() {
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('readinessResult');
        if (stored) setResult(JSON.parse(stored));
        else navigate('/readiness-check');
    }, [navigate]);

    if (!result) return null;

    const {
        career, readinessScore, breakdown,
        missingSkills, burnoutRisk, insight,
        improvementPath, backupPaths
    } = result;

    const vContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
    const vItem = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <motion.div className="readiness-res-page" variants={vContainer} initial="hidden" animate="visible">
            <div className="readiness-res-container">
                <motion.div variants={vItem} className="readiness-res-header">
                    <span className="readiness-badge">Career Readiness Diagnostic</span>
                    <h1>{career.title}</h1>
                    <div className={`score-meter ${readinessScore >= 80 ? 'high' : readinessScore >= 50 ? 'medium' : 'low'}`}>
                        <strong>{readinessScore}%</strong> Overall Readiness
                    </div>
                    <p className="readiness-insight">{insight}</p>
                </motion.div>

                <div className="readiness-res-grid">
                    {/* Left Column */}
                    <motion.div className="readiness-col" variants={vItem}>
                        <div className="readiness-card breaks-card">
                            <h3>Readiness Breakdown</h3>

                            <div className="r-score-group">
                                <label>Skill & Trait Match</label>
                                <div className="r-bar-bg"><div className="r-bar-fill blue" style={{ width: `${breakdown.skillMatch}%` }}></div></div>
                                <span className="r-bar-val">{breakdown.skillMatch}%</span>
                            </div>

                            <div className="r-score-group">
                                <label>Effort Alignment</label>
                                <div className="r-bar-bg"><div className="r-bar-fill purple" style={{ width: `${breakdown.effortAlignment}%` }}></div></div>
                                <span className="r-bar-val">{breakdown.effortAlignment}%</span>
                            </div>

                            <div className="r-score-group">
                                <label>Time Commitment Fit</label>
                                <div className="r-bar-bg"><div className="r-bar-fill green" style={{ width: `${breakdown.timeFit}%` }}></div></div>
                                <span className="r-bar-val">{breakdown.timeFit}%</span>
                            </div>

                            <div className="r-score-group">
                                <label>Stability & Practical Feasibility</label>
                                <div className="r-bar-bg"><div className="r-bar-fill orange" style={{ width: `${breakdown.feasibility}%` }}></div></div>
                                <span className="r-bar-val">{breakdown.feasibility}%</span>
                            </div>
                        </div>

                        <div className="readiness-card threat-card">
                            <h3>Reality & Risk Assessment</h3>
                            <div className="r-metric-row">
                                <span>Projected Burnout Risk:</span>
                                <strong className={`val-${burnoutRisk.split(' ')[0].toLowerCase()}`}>{burnoutRisk}</strong>
                            </div>
                            <div className="r-metric-row">
                                <span>Industry Demand Check:</span>
                                <strong className="val-text">{career.realityCheck}</strong>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <motion.div className="readiness-col" variants={vItem}>

                        {missingSkills.length > 0 && (
                            <div className="readiness-card gap-card">
                                <h3>Critical Skill Gaps Detected</h3>
                                <p>You are missing these traits/skills which are essential for this role:</p>
                                <div className="skill-tags mt-4">
                                    {missingSkills.map((s, i) => <span key={i} className="skill-tag danger">{s}</span>)}
                                </div>
                            </div>
                        )}

                        <div className="readiness-card action-card">
                            <h3>Immediate Improvement Path</h3>
                            <ul className="r-action-list">
                                {improvementPath.map((path, idx) => (
                                    <li key={idx}>{path}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="readiness-card backups-card">
                            <h3>Safer / Alternative Paths</h3>
                            <p className="r-desc">If this career's readiness is low, consider pivoting to these aligned paths:</p>
                            <div className="backup-list mt-4">
                                {backupPaths.map((bp, idx) => (
                                    <div key={idx} className="backup-item">
                                        <div className="backup-dot" />
                                        <span>{bp}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                </div>

                <motion.div className="intel-actions mt-6" variants={vItem}>
                    <button className="secondary-btn" onClick={() => navigate('/readiness-check')}>Retake Diagnostic</button>
                    <button className="primary-readiness" onClick={() => navigate('/')}>Back to Hub</button>
                </motion.div>
            </div>
        </motion.div>
    );
}
