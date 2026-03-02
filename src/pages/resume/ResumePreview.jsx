import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import html2pdf from 'html2pdf.js';
import TemplateA from '../../components/resume/TemplateA';
import TemplateB from '../../components/resume/TemplateB';
import TemplateC from '../../components/resume/TemplateC';
import TemplateD from '../../components/resume/TemplateD';
import './ResumePreview.css';

const ResumePreview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const resumeRef = useRef(null);
    const [resumeData, setResumeData] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState('A');
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem('resumeData');
        const template = localStorage.getItem('selectedTemplate');

        if (!data) {
            navigate('/resume/form');
            return;
        }

        try {
            setResumeData(JSON.parse(data));
        } catch (err) {
            console.error('Failed to parse resumeData from localStorage', err);
            navigate('/resume/form');
            return;
        }
        setSelectedTemplate(template || 'A');
    }, [navigate]);

    // Normalize resume data so templates never crash on unexpected shapes
    const normalized = useMemo(() => {
        if (!resumeData) return null;
        try {
            const copy = JSON.parse(JSON.stringify(resumeData));

            // Ensure personalInfo exists
            if (!copy.personalInfo) copy.personalInfo = {};
            copy.personalInfo.fullName = copy.personalInfo.fullName || '';
            copy.personalInfo.email = copy.personalInfo.email || '';
            copy.personalInfo.phone = copy.personalInfo.phone || '';
            copy.personalInfo.location = copy.personalInfo.location || '';

            // Ensure arrays
            copy.experience = Array.isArray(copy.experience) ? copy.experience : [];
            copy.education = Array.isArray(copy.education) ? copy.education : [];
            copy.projects = Array.isArray(copy.projects) ? copy.projects : [];

            // Normalize education entries: map 'school' to 'institution', 'year' to 'start'/'end'
            copy.education = copy.education.map(edu => ({
                degree: edu.degree || '',
                institution: edu.institution || edu.school || '',
                school: edu.school || edu.institution || '',
                location: edu.location || '',
                start: edu.start || edu.year || '',
                end: edu.end || '',
                year: edu.year || edu.start || '',
                score: edu.score || ''
            }));

            // Normalize skills to arrays
            if (!copy.skills) copy.skills = { technical: [], soft: [] };
            if (typeof copy.skills.technical === 'string') {
                copy.skills.technical = copy.skills.technical.split(',').map(s => s.trim()).filter(Boolean);
            }
            if (!Array.isArray(copy.skills.technical)) copy.skills.technical = [];
            if (typeof copy.skills.soft === 'string') {
                copy.skills.soft = copy.skills.soft.split(',').map(s => s.trim()).filter(Boolean);
            }
            if (!Array.isArray(copy.skills.soft)) copy.skills.soft = [];

            // Ensure objective
            copy.objective = copy.objective || '';

            // Ensure certifications (can be string or array)
            if (!copy.certifications) copy.certifications = '';

            // Ensure hobbies
            copy.hobbies = copy.hobbies || '';

            // Ensure languages
            if (!Array.isArray(copy.languages)) copy.languages = [];

            return copy;
        } catch (err) {
            console.error('Error normalizing resume data', err);
            return null;
        }
    }, [resumeData]);

    const handleDownload = () => {

        if (!resumeRef.current) return;

        setIsExporting(true);

        const element = resumeRef.current;
        const fullName = (normalized && normalized.personalInfo && normalized.personalInfo.fullName) || 'Resume';
        const opt = {
            margin: 0,
            filename: `${fullName.replace(/\s+/g, '_')}_Resume.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save().then(async () => {
            setIsExporting(false);
        }).catch(err => {
            console.error('PDF export failed', err);
            setIsExporting(false);
        });
    };

    if (!normalized) return null;

    const renderTemplate = () => {
        switch (selectedTemplate) {
            case 'A': return <TemplateA data={normalized} />;
            case 'B': return <TemplateB data={normalized} />;
            case 'C': return <TemplateC data={normalized} />;
            case 'D': return <TemplateD data={normalized} />;
            default: return <TemplateA data={normalized} />;
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
