import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { calculateReadiness } from '../utils/readinessLogic';
import { intelligenceCareers } from '../data/intelligenceCareers';
import Loader from '../components/Loader';
import './ReadinessCheck.css';

export default function ReadinessCheck() {
    const { user, checkLimit, registerUsage } = useAuth();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(0);

    // Form states
    const [targetCareerId, setTargetCareerId] = useState('');
    const [careerStage, setCareerStage] = useState('');
    const [experienceTypes, setExperienceTypes] = useState([]);
    const [skillDepth, setSkillDepth] = useState('');

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
        if (!checkLimit('labs')) {
            const upgrade = window.confirm('You have reached the limit for Readiness Check sessions on your current plan. Upgrade to unlock more?');
            if (upgrade) navigate('/pricing');
            return;
        }
        setIsSubmitting(true);
        const compiledAnswers = {
            targetCareerId,
            careerStage,
            experienceTypes,
            skillDepth,
            currentSkills,
            effortTolerance,
            timeAvailability,
            financialPressure,
            stabilityNeeds
        };

        const result = calculateReadiness(compiledAnswers);

        if (result) {
            localStorage.setItem('readinessResult', JSON.stringify(result));

            try {
                const { saveAnalysisForUser } = await import('../firebase/firebase');
                if (user && user.uid) {
                    const analysisToSave = {
                        name: `Readiness: ${result.career.title}`,
                        type: 'readiness_check',
                        compiledAnswers,
                        result,
                    };
                    await saveAnalysisForUser(user.uid, analysisToSave);
                    await registerUsage('labs');
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
                        <h1>Career Journey Mapper</h1>
                        <p className="subtitle">Evaluate your exact career stage and readiness.</p>
                        <div className="intro-card">
                            <p>👉 Found a career you love? Let's see exactly where you stand in that journey today.</p>
                            <p>👉 We map your current phase (Student, Intern, Switcher), identify missing experience, and analyze skill gaps.</p>
                            <p>👉 Get a brutally honest Role-Readiness assessment before committing years of your life.</p>
                        </div>
                        <button className="cta-button primary-readiness" onClick={handleNext}>Map My Journey</button>
                    </motion.div>
                )}

                {step === 1 && (
                    <motion.div className="readiness-step" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2>1. Select Your Target Career</h2>
                        <p>Which career path are you mapping?</p>

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
                        <h2>2. Current Career Stage</h2>
                        <p>Where are you currently in your journey?</p>

                        <div className="q-block mt-4">
                            <label>General Life Phase:</label>
                            <select
                                className="intel-input"
                                value={careerStage}
                                onChange={(e) => setCareerStage(e.target.value)}
                            >
                                <option value="" disabled>Select your stage...</option>
                                <option value="Student">Student</option>
                                <option value="Learning Skills">Learning Skills Independently</option>
                                <option value="Doing Projects">Doing Projects (Building Portfolio)</option>
                                <option value="Internship Done">Completed Internships</option>
                                <option value="Freelancing">Freelancing / Gig Work</option>
                                <option value="Working (Entry level)">Working (Entry Level in field)</option>
                                <option value="Switching Career">Switching Career (From different field)</option>
                            </select>
                        </div>

                        <div className="q-block mt-4">
                            <label>What kind of experience do you actually have? (Select all that apply)</label>
                            <div className="options-grid multi">
                                {['Projects', 'Internships', 'Certifications', 'Job Experience', 'Competitions', 'Portfolio work'].map(opt => (
                                    <div key={opt} className={`intel-opt ${experienceTypes.includes(opt) ? 'active' : ''}`} onClick={() => toggleArrayItem(setExperienceTypes, experienceTypes, opt)}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="q-block mt-4">
                            <label>What is your overall depth in your chosen core skills?</label>
                            <div className="options-grid single">
                                {['Beginner', 'Intermediate', 'Advanced'].map(opt => (
                                    <div key={opt} className={`intel-opt ${skillDepth === opt ? 'active' : ''}`} onClick={() => setSkillDepth(opt)}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div className="readiness-step" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2>3. Current Skills & Effort Profile</h2>
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

                {step === 4 && (
                    <motion.div className="readiness-step" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2>4. Time & Financial Reality</h2>

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
                        {step < 4 ? (
                            <button
                                className="primary-readiness"
                                onClick={handleNext}
                                disabled={(step === 1 && !targetCareerId) || (step === 2 && (!careerStage || !skillDepth))}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                className="primary-readiness submit"
                                onClick={handleSubmit}
                                disabled={!timeAvailability || !financialPressure || !stabilityNeeds}
                            >
                                Map Career Stage
                            </button>
                        )}
                    </div>
                )}

                {step > 0 && (
                    <div className="intel-progress mt-4">
                        <div className="intel-progress-bar" style={{ width: `${(step / 4) * 100}%`, background: '#f59e0b' }}></div>
                    </div>
                )}
            </div>
        </div >
    );
}
