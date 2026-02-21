import React from 'react';
import './Loader.css';

const Loader = () => {
    return (
        <div className="loader-overlay">
            <div className="loader-content">
                <div className="spinner-container">
                    <div className="orbit orbit-1"></div>
                    <div className="orbit orbit-2"></div>
                    <div className="orbit orbit-3"></div>
                    <div className="loader-spinner-core"></div>
                </div>
                <h2 className="loader-text">Analyzing your answers...</h2>
                <p className="loader-subtext">AI is mapping your ideal career path — just a minute</p>
            </div>
        </div>
    );
};

export default Loader;
