import React from 'react';
import './LoadingGate.css';

const LoadingGate = () => {
    return (
        <div className="loading-gate">
            <div className="loading-content">
                <div className="system-orb pulse"></div>
                <h2 className="loading-title">Wait a <span style={{ color: 'var(--bg-sage)' }}>Minute</span></h2>
                <div className="loading-bar-container">
                    <div className="loading-bar-progress"></div>
                </div>
                <p className="loading-status">Synchronizing Career Intelligence...</p>
            </div>
            <div className="loading-footer">
                Securing your session & preparing dataset
            </div>
        </div>
    );
};

export default LoadingGate;
