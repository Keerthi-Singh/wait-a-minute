import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { calculateReadiness } from '../utils/readinessLogic';
import { intelligenceCareers } from '../data/intelligenceCareers';
import Loader from '../components/Loader';
import './ReadinessCheck.css';

export default function ReadinessCheck() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(0);

    // Form states
    const [targetCareerId, setTargetCareerId] = useState('');
    const [currentSkills, setCurrentSkills] = useState([]);
    const [effortTolerance, setEffortTolerance] = useState('');
    const [timeAvailability, setTimeAvailability] = useState('');
    const [financialPressure, setFinancialPressure] = useState('');
    const [stabilityNeeds, setStabilityNeeds] = useState('');

    const toggleArrayItem = (setter, array, item) => {
        if (array.includes(item)) setter(array.filter(i => i !== item));
        else setter([...array, item]);
    };

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const compiledAnswers = {
            targetCareerId, currentSkills, effortTolerance, timeAvailability, financialPressure, stabilityNeeds
        };

        const result = calculateReadiness(compiledAnswers);

        if (result) {
            localStorage.setItem('readinessResult', JSON.stringify(result));

            try {
                const { saveAnalysisForUser } = await import('../firebase/firebase');
                if (user && user.uid) {
                    const analysisToSave = {
                        name: `Readiness Check: ${result.career.title}`,
                        type: 'readiness_check',
                        compiledAnswers,
                        result,
                    };
                    await saveAnalysisForUser(user.uid, analysisToSave);
                }
            } catch (err) {
                console.warn("Could not save to firestore", err);
            }
        }

        setTimeout(() => {
            navigate('/readiness-result');
        }, 1500);
    };

    if (isSubmitting) return <Loader />;

    return (
        <div className="readiness-page">
            <div className="readiness-container">
                {step === 0 && (
                    <motion.div className="readiness-step intro-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h1>Career Readiness Check</h1>
                        <p className="subtitle">Evaluate your preparedness for your dream career.</p>
                        <div className="intro-card">
                            <p>👉 Found a career you love? Let's see if you're actually ready to pursue it right now.</p>
                            <p>👉 We evaluate your skill gaps, effort tolerance, financial flexibility, and stability needs.</p>
                            <p>👉 Get a brutally honest Reality Check Score before committing years of your life.</p>
                        </div>
                        <button className="cta-button primary-readiness" onClick={handleNext}>Check My Readiness</button>
                    </motion.div>
                )}

                {step === 1 && (
                    <motion.div className="readiness-step" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2>1. Select Your Target Career</h2>
                        <p>Which career path are you aiming for?</p>

                        <div className="q-block mt-4">
                            <select
                                className="intel-input"
                                value={targetCareerId}
                                onChange={(e) => setTargetCareerId(e.target.value)}
                            >
                                <option value="" disabled>Select a career...</option>
                                {intelligenceCareers.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div className="readiness-step" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2>2. Current Skills & Effort Profile</h2>
                        <p>Check all the strengths and traits you CURRENTLY possess.</p>

                        <div className="q-block">
                            <div className="options-grid multi">
                                {['Logic', 'Creativity', 'Empathy', 'Communication', 'Discipline', 'Leadership', 'Physical ability', 'Focus', 'Patience'].map(opt => (
                                    <div key={opt} className={`intel-opt ${currentSkills.includes(opt) ? 'active' : ''}`} onClick={() => toggleArrayItem(setCurrentSkills, currentSkills, opt)}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="q-block mt-4">
                            <label>What level of raw effort are you currently prepared to put in?</label>
                            <div className="options-grid single">
                                {['Low', 'Medium', 'High', 'Extreme'].map(opt => (
                                    <div key={opt} className={`intel-opt ${effortTolerance === opt ? 'active' : ''}`} onClick={() => setEffortTolerance(opt)}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div className="readiness-step" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2>3. Time & Financial Reality</h2>

                        <div className="q-block">
                            <label>How much dedicated time do you have to achieve stability in this role?</label>
                            <div className="options-grid single">
                                {['Immediate (Need a job now)', '1-2 Years', '3-5 Years', '5+ Years (Long Game)'].map(opt => (
                                    <div key={opt} className={`intel-opt ${timeAvailability === opt ? 'active' : ''}`} onClick={() => setTimeAvailability(opt)}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="q-block mt-4">
                            <label>What is your current financial pressure?</label>
                            <div className="options-grid single">
                                {['High', 'Medium', 'Low'].map(opt => (
                                    <div key={opt} className={`intel-opt ${financialPressure === opt ? 'active' : ''}`} onClick={() => setFinancialPressure(opt)}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="q-block mt-4">
                            <label>How much stability do you demand in your life?</label>
                            <div className="options-grid single">
                                {['Low Risk / High Stability', 'Moderate', 'High Risk / High Reward'].map(opt => (
                                    <div key={opt} className={`intel-opt ${stabilityNeeds === opt ? 'active' : ''}`} onClick={() => setStabilityNeeds(opt)}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step > 0 && (
                    <div className="intel-actions mt-6">
                        <button className="secondary-btn" onClick={handleBack}>Back</button>
                        {step < 3 ? (
                            <button
                                className="primary-readiness"
                                onClick={handleNext}
                                disabled={step === 1 && !targetCareerId}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                className="primary-readiness submit"
                                onClick={handleSubmit}
                                disabled={!timeAvailability || !financialPressure || !stabilityNeeds}
                            >
                                Calculate Readiness
                            </button>
                        )}
                    </div>
                )}

                {step > 0 && (
                    <div className="intel-progress mt-4">
                        <div className="intel-progress-bar" style={{ width: `${(step / 3) * 100}%`, background: '#f59e0b' }}></div>
                    </div>
                )}
            </div>
        </div>
    );
}
