import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from '../components/QuestionCard';
import Loader from '../components/Loader';
import { careerQuestions } from '../data/questions';
import { analyzeCareer } from '../utils/analyzerLogic';
import './Analyzer.css';

const Analyzer = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSelect = (answer) => {
        setAnswers({ ...answers, [currentStep]: answer });
    };

    const handleNext = () => {
        if (currentStep < careerQuestions.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const { user } = useAuth();

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Perform Rule-Based Analysis
        const result = analyzeCareer(answers);

        // Name this analysis automatically based on the primary career
        const analysisName = result.primaryCareer ? result.primaryCareer.title : (result.career || 'My Analysis');

        // Save to localStorage for quick access
        localStorage.setItem('careerResult', JSON.stringify(result));

        // Try to save to Firestore under the current user
        try {
            const { saveAnalysisForUser } = await import('../firebase/firebase');
            if (user && user.uid) {
                if (user.email && user.emailVerified === false) {
                    const goVerify = window.confirm('Your email is not verified. Verify now to save this analysis to your account?');
                    if (goVerify) {
                        window.location.href = '/auth/verify';
                        return;
                    }
                }
                const analysisToSave = {
                    name: analysisName,
                    answers,
                    result,
                    careerTitle: result.career || null,
                    description: result.description || null,
                    skills: result.skills || [],
                    goals: result.goals || [],
                    primaryCareer: result.primaryCareer || null,
                    secondaryCareer: result.secondaryCareer || null,
                    compatibilityScore: result.compatibilityScore || null
                };
                await saveAnalysisForUser(user.uid, analysisToSave);
            } else {
                const shouldLogin = window.confirm('You are not signed in. Sign in to save this analysis to your account?');
                if (shouldLogin) {
                    window.location.href = '/auth/login';
                }
            }
        } catch (err) {
            console.warn('Could not save analysis to Firestore:', err);
        }

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1200));

        navigate('/result');
    };

    if (isSubmitting) return <Loader />;

    const currentQuestion = careerQuestions[currentStep];
    const isLastStep = currentStep === careerQuestions.length - 1;
    const hasSelected = answers[currentStep] !== undefined;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="analyzer-page"
        >
            <div className="analyzer-container">
                <div className="navigation-header">
                    <button className="back-nav-btn" onClick={() => navigate('/')}>
                        {currentStep === 0 ? '← Exit' : ''}
                    </button>
                    <div className="header-labels">
                        <span className="step-label">Step {currentStep + 1}</span>
                        <span className="topic-label">{currentQuestion.topic}</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <QuestionCard
                            question={currentQuestion.question}
                            options={currentQuestion.options}
                            selectedOption={answers[currentStep]}
                            onSelect={handleSelect}
                            questionNumber={currentStep + 1}
                            totalQuestions={careerQuestions.length}
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="action-footer">
                    <button
                        className={`nav-btn secondary ${currentStep === 0 ? 'disabled' : ''}`}
                        onClick={handleBack}
                        disabled={currentStep === 0}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back
                    </button>

                    {isLastStep ? (
                        <button
                            className={`nav-btn primary ${!hasSelected ? 'disabled' : ''}`}
                            onClick={handleSubmit}
                            disabled={!hasSelected}
                        >
                            Get My Result
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                                <polyline points="9 11 12 14 22 4" />
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            className={`nav-btn primary ${!hasSelected ? 'disabled' : ''}`}
                            onClick={handleNext}
                            disabled={!hasSelected}
                        >
                            Next
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Analyzer;
