import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateAIThreat } from '../utils/aiThreatLogic';
import './AIThreatIndex.css';

const AIThreatIndex = () => {
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const scanMessages = [
        "Connecting to LinkedIn...",
        "Identifying profile handle...",
        "Analyzing professional footprint...",
        "Inferring role and expertise...",
        "Matching against AI automation datasets...",
        "Calculating risk vectors...",
        "Finalizing threat index..."
    ];

    useEffect(() => {
        if (isScanning && scanStep < scanMessages.length - 1) {
            const timer = setTimeout(() => {
                setScanStep(s => s + 1);
            }, 700 + Math.random() * 300);
            return () => clearTimeout(timer);
        }
    }, [isScanning, scanStep]);

    const handleStartScan = async (e) => {
        e.preventDefault();
        if (!linkedinUrl || !linkedinUrl.includes('linkedin.com/')) {
            setError("Please enter a valid LinkedIn Profile URL.");
            return;
        }

        setError(null);
        setIsScanning(true);
        setScanStep(0);
        setResult(null);

        try {
            const assessment = await calculateAIThreat(linkedinUrl);

            // Wait for animation to finish (at least 5 seconds)
            setTimeout(() => {
                setResult(assessment);
                setIsScanning(false);
            }, 5000);

        } catch (err) {
            console.error(err);
            setError("Failed to analyze. Please check your connection.");
            setIsScanning(false);
        }
    };

    const reset = () => {
        setResult(null);
        setIsScanning(false);
        setLinkedinUrl('');
    };

    return (
        <motion.div
            className="ai-threat-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="threat-container">
                <div className="threat-card">
                    <AnimatePresence mode="wait">
                        {!isScanning && !result && (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="input-view"
                            >
                                <div className="threat-header">
                                    <h1>Will AI Take Your Job?</h1>
                                    <p>Drop your LinkedIn profile and it will analyze and score the threat of AI taking your job.</p>
                                </div>

                                <form className="input-section" onSubmit={handleStartScan}>
                                    <div className="q-block">
                                        <label>LinkedIn Profile Link</label>
                                        <div className="linkedin-input-group">
                                            <input
                                                type="text"
                                                value={linkedinUrl}
                                                onChange={(e) => setLinkedinUrl(e.target.value)}
                                                placeholder="https://www.linkedin.com/in/username"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {error && <p className="error-msg" style={{ color: '#ef4444', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}

                                    <button type="submit" className="scan-btn mt-6">
                                        Analyze Profile Risk
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {isScanning && (
                            <motion.div
                                key="scanning"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="scanning-view"
                            >
                                <div className="loader-container">
                                    <div className="pulse-circle">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                                        </svg>
                                    </div>
                                    <div className="scan-status-container">
                                        <div className="scan-status" style={{ minHeight: '1.5em' }}>
                                            {scanMessages[scanStep]}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="result-view"
                            >
                                <div className="result-score-header">
                                    <div className="overall-score-section">
                                        <span className="label">AI THREAT LEVEL</span>
                                        <div className="score-value">
                                            <span className="big-num">{result.overallScore}</span>
                                            <span className="max-num">/ 10</span>
                                        </div>
                                    </div>
                                    <div className="result-title-section">
                                        <h2 className="role-title">{result.roleTitle}</h2>
                                        <p className="role-description">{result.roleDescription}</p>
                                    </div>
                                </div>

                                <div className="analysis-grid">
                                    {result.categories.map((cat, i) => (
                                        <div key={i} className="analysis-card brutalist-card">
                                            <div className="card-header">
                                                <h3 className="category-name">{cat.name}</h3>
                                                <span className="category-score">{cat.score} / 10</span>
                                            </div>
                                            <p className="category-description">{cat.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="result-actions">
                                    <button className="brutalist-button" onClick={reset}>
                                        Analyze Another Profile
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default AIThreatIndex;
