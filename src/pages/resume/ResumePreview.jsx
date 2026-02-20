import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import TemplateA from '../../components/resume/TemplateA';
import TemplateB from '../../components/resume/TemplateB';
import TemplateC from '../../components/resume/TemplateC';
import './ResumePreview.css';

const ResumePreview = () => {
    const navigate = useNavigate();
    const resumeRef = useRef(null);
    const [resumeData, setResumeData] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState('A');
    const [isExporting, setIsExporting] = useState(false);
    const [accentColor, setAccentColor] = useState('#1a237e');

    const getContrastColor = (hex) => {
        if (!hex) return '#000';
        const h = hex.replace('#', '');
        const r = parseInt(h.substring(0, 2), 16) / 255;
        const g = parseInt(h.substring(2, 4), 16) / 255;
        const b = parseInt(h.substring(4, 6), 16) / 255;
        const lr = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
        const lg = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
        const lb = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
        const lum = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
        return lum > 0.6 ? '#111111' : '#ffffff';
    };

    useEffect(() => {
        const data = localStorage.getItem('resumeData');
        const template = localStorage.getItem('selectedTemplate');
        const accent = localStorage.getItem('selectedAccent');

        if (!data) {
            navigate('/resume/form');
            return;
        }

        setResumeData(JSON.parse(data));
        setSelectedTemplate(template || 'A');
        if (accent) setAccentColor(accent);
    }, [navigate]);

    const handleDownload = () => {
        if (!resumeRef.current) return;

        setIsExporting(true);

        const element = resumeRef.current;
        const opt = {
            margin: 0,
            filename: `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save().then(() => {
            setIsExporting(false);
        });
    };

    if (!resumeData) return null;

    const renderTemplate = () => {
        const props = { data: resumeData, accentColor, accentTextColor: getContrastColor(accentColor) };
        switch (selectedTemplate) {
            case 'A': return <TemplateA {...props} />;
            case 'B': return <TemplateB {...props} />;
            case 'C': return <TemplateC {...props} />;
            default: return <TemplateA {...props} />;
        }
    };

    return (
        <div className="resume-preview-page">
            <header className="preview-toolbar no-print">
                <div className="toolbar-left">
                    <button className="icon-btn" onClick={() => navigate('/resume/templates')}>
                        ← Change Template
                    </button>
                </div>
                <div className="toolbar-center">
                    <h2>{isExporting ? 'Generating PDF...' : 'Resume Preview'}</h2>
                </div>
                <div className="toolbar-right">
                    <button className="secondary-btn" onClick={() => navigate('/resume/form')}>Edit</button>
                    <button
                        className={`cta-button ${isExporting ? 'loading' : ''}`}
                        onClick={handleDownload}
                        disabled={isExporting}
                    >
                        {isExporting ? 'Exporting...' : 'Download PDF'}
                    </button>
                </div>
            </header>

            <motion.div
                className="resume-container-preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div ref={resumeRef} id="resume-to-print">
                    {renderTemplate()}
                </div>
            </motion.div>

            <div className="print-hint no-print">
                <p>Pro tip: Use "Save as PDF" in the print dialog for the best results.</p>
            </div>
        </div>
    );
};

export default ResumePreview;
