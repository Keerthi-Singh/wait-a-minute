import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLANS } from '../data/plans';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
    const { subscription, upgradePlan } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showMoreDetails, setShowMoreDetails] = useState(null);
    const navigate = useNavigate();

    const handleSelectPlan = (plan) => {
        if (plan.id === subscription?.planId) return;
        setSelectedPlan(plan);
    };

    const handleConfirmPayment = async () => {
        setIsProcessing(true);
        // Mock payment delay
        await new Promise(r => setTimeout(r, 2000));
        await upgradePlan(selectedPlan.id);
        setIsProcessing(false);
        setSelectedPlan(null);
        navigate('/');
    };

    return (
        <div className="pricing-container">
            <header className="pricing-header">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Unlock Your <span className="gradient-text">Career Potential</span>
                </motion.h1>
                <p>Choose the intelligence layer that fits your ambition.</p>
            </header>

            <div className="pricing-grid">
                {Object.values(PLANS).map((plan) => (
                    <motion.div
                        key={plan.id}
                        className={`pricing-card glass-card ${plan.id === subscription?.planId ? 'current' : ''} ${plan.id === 'elite' ? 'featured' : ''}`}
                        whileHover={{ y: -5 }}
                    >
                        {plan.id === 'elite' && <div className="featured-badge">MOST POWERFUL</div>}
                        {plan.id === subscription?.planId && <div className="current-badge">YOUR PLAN</div>}

                        <h3>{plan.name}</h3>
                        <div className="price">{plan.price}<span>/ lifetime access</span></div>

                        <ul className="features-list">
                            {plan.features.map((feat, i) => (
                                <li key={i}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    {feat}
                                </li>
                            ))}
                        </ul>

                        <div className="plan-dropdown">
                            <button
                                className="details-toggle"
                                onClick={() => setShowMoreDetails(showMoreDetails === plan.id ? null : plan.id)}
                            >
                                {showMoreDetails === plan.id ? 'Hide Details' : 'View Specifics'}
                                <svg
                                    style={{ transform: showMoreDetails === plan.id ? 'rotate(180deg)' : 'none' }}
                                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>
                            <AnimatePresence>
                                {showMoreDetails === plan.id && (
                                    <motion.div
                                        className="details-content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                    >
                                        <p><strong>Downloads:</strong> {plan.resumeDownloads} Resumes</p>
                                        <p><strong>Analyses:</strong> {plan.analyses} Full Reports</p>
                                        <p><strong>Intelligence Lab:</strong> {plan.labsUsage} Usage Tokens</p>
                                        <p className="description-text">Full access to AI-driven insights and future-proof career mapping.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            className={`plan-button ${plan.id === 'elite' ? 'cta-button' : 'cta-outline'}`}
                            onClick={() => handleSelectPlan(plan)}
                            disabled={plan.id === subscription?.planId || plan.id === 'free'}
                        >
                            {plan.id === subscription?.planId ? 'Active Plan' : plan.id === 'free' ? 'Default Access' : 'Upgrade Now'}
                        </button>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedPlan && (
                    <div className="mock-payment-overlay">
                        <motion.div
                            className="payment-modal glass-card"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h2>Secure Checkout</h2>
                            <p>You are upgrading to <strong>{selectedPlan.name}</strong></p>
                            <div className="payment-summary">
                                <span>Total Amount:</span>
                                <span className="total">{selectedPlan.price}</span>
                            </div>

                            <div className="mock-card">
                                <div className="chip"></div>
                                <div className="number">**** **** **** 4242</div>
                                <div className="brand">VISA</div>
                            </div>

                            <button
                                className="cta-button full-width"
                                onClick={handleConfirmPayment}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <div className="bt-spinner"></div>
                                ) : `Pay ${selectedPlan.price}`}
                            </button>
                            <button className="secondary-btn" onClick={() => setSelectedPlan(null)}>Cancel</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Pricing;
