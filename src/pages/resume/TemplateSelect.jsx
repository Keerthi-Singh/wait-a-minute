import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './TemplateSelect.css';

const templates = [
    { id: 'A', name: 'Classic Professional', description: 'Traditional and clean layout for conservative industries.' },
    { id: 'B', name: 'Modern Duo', description: 'Sleek two-column design that highlights skills and experience.' },
    { id: 'C', name: 'Creative Pulse', description: 'Bold and vibrant layout for designers and creatives.' }
];

const TemplateSelect = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState('A');

    const handleSelect = (id) => {
        setSelected(id);
        localStorage.setItem('selectedTemplate', id);
    };

    const handleProceed = () => {
        localStorage.setItem('selectedTemplate', selected);
        navigate('/resume/preview');
    };

    return (
        <div className="template-select-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="template-container"
            >
                <header className="page-header">
                    <h1>Select Your <span className="gradient-text">Template</span></h1>
                    <p>Choose a design that matches your professional personality.</p>
                </header>

                <div className="template-grid">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className={`template-card ${selected === template.id ? 'active' : ''}`}
                            onClick={() => handleSelect(template.id)}
                        >
                            <div className={`template-preview preview-${template.id.toLowerCase()}`}>
                                <div className="preview-overlay">
                                    <span>Selected</span>
                                </div>
                            </div>
                            <div className="template-info">
                                <h3>{template.name}</h3>
                                <p>{template.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="template-actions">
                    <button className="back-btn" onClick={() => navigate('/resume/form')}>Back to Edit</button>
                    <button className="cta-button" onClick={handleProceed}>Preview Resume</button>
                </div>
            </motion.div>
        </div>
    );
};

export default TemplateSelect;
