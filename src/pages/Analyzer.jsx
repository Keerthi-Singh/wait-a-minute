import React, { useState } from 'react';
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

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Perform Rule-Based Analysis
        const result = analyzeCareer(answers);

        // Save to localStorage for persistence
        localStorage.setItem('careerResult', JSON.stringify(result));

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 3000));

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
                        Back
                    </button>

                    {isLastStep ? (
                        <button
                            className={`nav-btn primary ${!hasSelected ? 'disabled' : ''}`}
                            onClick={handleSubmit}
                            disabled={!hasSelected}
                        >
                            Get My Result
                        </button>
                    ) : (
                        <button
                            className={`nav-btn primary ${!hasSelected ? 'disabled' : ''}`}
                            onClick={handleNext}
                            disabled={!hasSelected}
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Analyzer;
