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
                    <div className="core"></div>
                </div>
                <h2 className="loader-text">Analyzing your answers...</h2>
                <p className="loader-subtext">Mapping your professional DNA to perfect career paths</p>
            </div>
        </div>
    );
};

export default Loader;
