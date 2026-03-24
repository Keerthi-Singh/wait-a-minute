import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeDeepIntelligence } from '../utils/intelligenceLogic';
import Loader from '../components/Loader';
import { IconChevronRight } from '../components/Icons';
import './IntelligenceLab.css';

// Using a custom wizard component designed for Deep Intelligence
export default function IntelligenceLab() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(0);

    // Form states
    const [style, setStyle] = useState('');
    const [focus, setFocus] = useState('');
    const [domains, setDomains] = useState([]);
    const [otherDomain, setOtherDomain] = useState('');
    const [lifestyle, setLifestyle] = useState('');
    const [effortTolerance, setEffortTolerance] = useState('');
    const [environments, setEnvironments] = useState([]);
    const [strengths, setStrengths] = useState([]);

    // We have 6 steps (0 to 5)
    // 0: Intro
    // 1: Personality (Style + Focus)
    // 2: Domains
    // 3: Lifestyle (Lifestyle + Effort)
    // 4: Environment & Strengths
    // 5: Submit

    const toggleArrayItem = (setter, array, item) => {
        if (array.includes(item)) setter(array.filter(i => i !== item));
        else setter([...array, item]);
    };

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const compiledAnswers = {
            style, focus, domains, otherDomain, lifestyle, effortTolerance, environments, strengths
        };

        const result = analyzeDeepIntelligence(compiledAnswers);
        localStorage.setItem('intelligenceResult', JSON.stringify(result));

        // Attempt to save to Firestore
        try {
            const { saveAnalysisForUser } = await import('../firebase/firebase');
            if (user && user.uid) {
                const analysisToSave = {
                    name: `Intelligence Deep Scan: ${result.topCareer.title}`,
                    type: 'intelligence_lab',
                    compiledAnswers,
                    result,
                };
                await saveAnalysisForUser(user.uid, analysisToSave);
            }
        } catch (err) {
            console.warn("Could not save to firestore", err);
        }

        setTimeout(() => {
            navigate('/intelligence-result');
        }, 1500);
    };

    if (isSubmitting) return <Loader />;

    return (
        <div className="intelligence-page">
            <div className="intel-container">
                {step === 0 && (
                    <motion.div className="intel-step intro-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h1>Career Intelligence Lab</h1>
                        <p className="subtitle">Advanced analysis for serious, life-altering career decisions.</p>
                        <div className="intro-card">
                            <p><IconChevronRight size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> This module analyzes your personality, effort tolerance, stability needs, risk appetite, and lifestyle expectations.</p>
                            <p><IconChevronRight size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> It maps across diverse fields including Government, Healthcare, Arts, Business, and Tech.</p>
                            <p><IconChevronRight size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> It simulates the next 5 years of your life to generate a Reality Check.</p>
                        </div>
                        <button className="cta-button primary-intel" onClick={handleNext}>Start Deep Analysis</button>
                    </motion.div>
                )}

                {step === 1 && (
                    <motion.div className="intel-step" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2>1. Personality & Thinking Style</h2>
                        <p>How does your mind operate?</p>

                        <div className="q-block">
                            <label>Do you prefer structured routines or creative freedom?</label>
                            <div className="options-grid single">
                                {['Strictly structured routines', 'Structured but flexible', 'Highly creative & free'].map(opt => (
                                    <div key={opt} className={`intel-opt ${style === opt ? 'active' : ''}`} onClick={() => setStyle(opt)}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="q-block mt-4">
                            <label>What do you enjoy doing most?</label>
                            <div className="options-grid single">
                                {[
                                    { label: 'Solving logical problems', val: 'logic' },
                                    { label: 'Expressing ideas & creating', val: 'creative' },
                                    { label: 'Working with people & helping', val: 'people' },
                                    { label: 'Leading processes & systems', val: 'leadership' }
                                ].map(opt => (
                                    <div key={opt.val} className={`intel-opt ${focus === opt.val ? 'active' : ''}`} onClick={() => setFocus(opt.val)}>
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div className="intel-step" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2>2. Interest Domains (Select 1-3)</h2>
                        <p>Broadly speaking, which fields excite you?</p>
                        <div className="options-grid multi">
                            {[
                                'Technology', 'Creative Arts, Film & Media', 'Education', 'Healthcare',
                                'Government & Civil Services', 'Defense & Police', 'Business & Finance',
                                'Social Impact', 'Science & Research', 'Sports', 'Environment & Sustainability', 'Law & Judiciary'
                            ].map(domain => (
                                <div key={domain} className={`intel-opt ${domains.includes(domain) ? 'active' : ''}`} onClick={() => toggleArrayItem(setDomains, domains, domain)}>
                                    {domain}
                                </div>
                            ))}
                        </div>
                        <div className="q-block mt-4">
                            <label>Other Interesting Field (Optional)</label>
                            <input type="text" className="intel-input" value={otherDomain} onChange={(e) => setOtherDomain(e.target.value)} placeholder="e.g. Aviation, Culinary Arts" />
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div className="intel-step" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2>3. Lifestyle & Effort Readiness</h2>

                        <div className="q-block">
                            <label>View on Stability vs Risk?</label>
                            <div className="options-grid single">
                                {['High stability, fixed income', 'Moderate stability, moderate risk', 'High risk, high reward (variable)', 'Impact over income'].map(opt => (
                                    <div key={opt} className={`intel-opt ${lifestyle === opt ? 'active' : ''}`} onClick={() => setLifestyle(opt)}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="q-block mt-4">
                            <label>Tolerance for Long-Term Study / Competitive Exams?</label>
                            <div className="options-grid single">
                                {['I can study 5-10 years to reach the top', 'I am okay with intense competitive exams', 'I prefer quick entry into the workforce', 'I avoid exams, prefer building things'].map(opt => (
                                    <div key={opt} className={`intel-opt ${effortTolerance === opt ? 'active' : ''}`} onClick={() => setEffortTolerance(opt)}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div className="intel-step" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2>4. Environment & Core Strengths</h2>

                        <div className="q-block">
                            <label>Preferred Environments (Select up to 2)</label>
                            <div className="options-grid multi">
                                {['Office', 'Creative studio', 'Outdoors/Field', 'High-Stress/Trading floor', 'Hospital/Clinic', 'Public-facing stage'].map(opt => (
                                    <div key={opt} className={`intel-opt ${environments.includes(opt) ? 'active' : ''}`} onClick={() => toggleArrayItem(setEnvironments, environments, opt)}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="q-block mt-4">
                            <label>Self-Rate: Your Greatest Strengths (Select exactly 2)</label>
                            <div className="options-grid multi">
                                {['Logic', 'Creativity', 'Empathy', 'Communication', 'Discipline', 'Leadership', 'Physical ability', 'Focus'].map(opt => (
                                    <div key={opt} className={`intel-opt ${strengths.includes(opt) ? 'active' : ''}`} onClick={() => toggleArrayItem(setStrengths, strengths, opt)}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step > 0 && (
                    <div className="intel-actions">
                        <button className="secondary-btn" onClick={handleBack}>Back</button>
                        {step < 4 ? (
                            <button className="primary-intel" onClick={handleNext}>Next</button>
                        ) : (
                            <button className="primary-intel submit" onClick={handleSubmit} disabled={strengths.length < 1}>
                                Calculate Life Path
                            </button>
                        )}
                    </div>
                )}

                {step > 0 && (
                    <div className="intel-progress">
                        <div className="intel-progress-bar" style={{ width: `${(step / 4) * 100}%` }}></div>
                    </div>
                )}
            </div>
        </div>
    );
}
