import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { generateActionPath } from '../utils/actionPathLogic';
import { IconCheck, IconX } from '../components/Icons';
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
        maturity, missingSkills, burnoutRisk, insight,
        improvementPath, backupPaths
    } = result;

    const actionPath = generateActionPath(career);

    const vContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
    const vItem = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <motion.div className="readiness-res-page" variants={vContainer} initial="hidden" animate="visible">
            <div className="readiness-res-container">
                <motion.div variants={vItem} className="readiness-res-header">
                    <span className="readiness-badge">Career Journey Diagnostic</span>
                    <h1>{career.title}</h1>
                    <div className={`score-meter ${readinessScore >= 80 ? 'high' : readinessScore >= 50 ? 'medium' : 'low'}`}>
                        <strong>{readinessScore}%</strong> Overall Role Readiness
                    </div>
                    <p className="readiness-insight">{insight}</p>
                </motion.div>

                {/* --- NEW MATURITY CARD --- */}
                <motion.div variants={vItem} className="readiness-card maturity-card">
                    <div className="maturity-header">
                        <div className="maturity-level-badge">Level {maturity.level}</div>
                        <div className="maturity-titles">
                            <h3>{maturity.title}</h3>
                            <p>{maturity.insight}</p>
                        </div>
                    </div>

                    <div className="maturity-grid">
                        <div className="m-col role-readiness">
                            <h4>Current Hierarchy Clearances</h4>
                            <div className="role-tags">
                                {maturity.roleReadiness.map((rr, i) => (
                                    <span key={i} className={`role-tag ${rr.ready ? 'ready' : 'not-ready'}`}>
                                        {rr.ready ? <IconCheck size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> : <IconX size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />} {rr.role}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="m-col ladder">
                            <h4>Standard Advancement Path</h4>
                            <div className="ladder-steps">
                                {maturity.ladder.map((l, i) => (
                                    <div key={i} className={`ladder-step ${i <= maturity.level ? 'achieved' : ''}`}>
                                        <div className="l-dot"></div>
                                        <span>{l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="readiness-res-grid">
                    {/* Left Column */}
                    <motion.div className="readiness-col" variants={vItem}>
                        <div className="readiness-card breaks-card">
                            <h3>Readiness Breakdown</h3>

                            <div className="r-score-group">
                                <label>Core Capability Match</label>
                                <div className="r-bar-bg"><div className="r-bar-fill blue" style={{ width: `${breakdown.skillMatch}%` }}></div></div>
                                <span className="r-bar-val">{breakdown.skillMatch}%</span>
                            </div>

                            <div className="r-score-group">
                                <label>Effort & Grind Alignment</label>
                                <div className="r-bar-bg"><div className="r-bar-fill purple" style={{ width: `${breakdown.effortAlignment}%` }}></div></div>
                                <span className="r-bar-val">{breakdown.effortAlignment}%</span>
                            </div>

                            <div className="r-score-group">
                                <label>Time & Finance Run-Rate</label>
                                <div className="r-bar-bg"><div className="r-bar-fill green" style={{ width: `${breakdown.timeFit}%` }}></div></div>
                                <span className="r-bar-val">{breakdown.timeFit}%</span>
                            </div>

                            <div className="r-score-group">
                                <label>Stability Reality Match</label>
                                <div className="r-bar-bg"><div className="r-bar-fill orange" style={{ width: `${breakdown.feasibility}%` }}></div></div>
                                <span className="r-bar-val">{breakdown.feasibility}%</span>
                            </div>
                        </div>

                        <div className="readiness-card threat-card">
                            <h3>Threat & Risk Mapping</h3>
                            <div className="r-metric-row">
                                <span>Projected Burnout Risk:</span>
                                <strong className={`val-${burnoutRisk.split(' ')[0].toLowerCase()}`}>{burnoutRisk}</strong>
                            </div>
                            <div className="r-metric-row">
                                <span>Industry Saturation:</span>
                                <strong className="val-text">{career.realityCheck}</strong>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <motion.div className="readiness-col" variants={vItem}>

                        {missingSkills.length > 0 && (
                            <div className="readiness-card gap-card">
                                <h3>Critical Trait Deficits</h3>
                                <p>You must actively compensate for missing these non-negotiable traits:</p>
                                <div className="skill-tags mt-4">
                                    {missingSkills.map((s, i) => <span key={i} className="skill-tag danger">{s}</span>)}
                                </div>
                            </div>
                        )}

                        <div className="readiness-card action-card">
                            <h3>Immediate Tactical Pivot</h3>
                            <ul className="r-action-list">
                                {improvementPath.map((path, idx) => (
                                    <li key={idx}>{path}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="readiness-card backups-card">
                            <h3>Strategic Failsafes</h3>
                            <p className="r-desc">If maturity level stalls, instantly pivot to these adjacent disciplines:</p>
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

                {/* --- NEW SECTION: CAREER ACTION PATH --- */}
                <motion.div variants={vItem} className="action-path-section">
                    <div className="action-path-header readiness-res-header">
                        <h2>Optimize Your Career Path</h2>
                        <p className="readiness-insight">Specific actions and certifications to boost your readiness immediately.</p>
                    </div>

                    <div className="action-path-grid">
                        <div className="readiness-card skills-card">
                            <h3>Target Skills Needed Now</h3>
                            <div className="skill-group">
                                <h4>Core Fundamentals</h4>
                                <div className="skill-tags">
                                    {actionPath.skills.core.map((s, i) => <span key={i} className="skill-tag core">{s}</span>)}
                                </div>
                            </div>
                            <div className="skill-group" style={{ marginTop: '1.5rem' }}>
                                <h4>Supporting / Adjacent Skills</h4>
                                <div className="skill-tags">
                                    {actionPath.skills.supporting.map((s, i) => <span key={i} className="skill-tag support">{s}</span>)}
                                </div>
                            </div>
                        </div>

                        <div className="action-path-col">
                            <div className="readiness-card certs-card" style={{ height: '100%' }}>
                                <h3>High-Impact Certifications</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Completing these jumps your maturity level rapidly:</p>
                                <ul className="r-action-list">
                                    {actionPath.certifications.map((c, i) => (
                                        <li key={i}>{c}</li>
                                    ))}
                                </ul>

                                <div className="job-buttons mt-6" style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.9rem' }}>Real World Demand</h4>
                                    <a href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(career.title)}`} target="_blank" rel="noopener noreferrer" className="cta-button google-job" style={{ width: '100%', textAlign: 'center', marginBottom: '0.5rem' }}>
                                        Scan Live Market Jobs
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div className="intel-actions mt-6" variants={vItem}>
                    <button className="secondary-btn" onClick={() => navigate('/readiness-check')}>Re-Evaluate Positioning</button>
                    <button className="primary-readiness" onClick={() => navigate('/')}>Back to Hub</button>
                </motion.div>
            </div>
        </motion.div>
    );
}
