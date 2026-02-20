import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { enhanceResumeBullet } from '../../utils/aiService';
import './ResumeForm.css';
import { getCurrentUser, saveResumeForUser } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';

const ResumeForm = ({ resumeData, setResumeData }) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('Personal Info');

    const [formData, setFormData] = useState({
        personalInfo: { fullName: '', email: '', phone: '', location: '', linkedIn: '', website: '' },
        objective: '',
        skills: { technical: '', soft: '' },
        experience: [{ company: '', role: '', duration: '', description: '' }],
        education: [{ school: '', degree: '', year: '' }],
        certifications: '',
        hobbies: ''
    });
    const emptyEntry = {
        education: [{ degree: '', institution: '', location: '', start: '', end: '', score: '' }],
        certifications: [{ name: '', platform: '', year: '' }],
        internships: [{ role: '', org: '', location: '', duration: '', desc: '' }],
        projects: [{ name: '', year: '', org: '' }],
        skills: { technical: [], soft: [] },
        languages: [],
    };

    const sections = [
        'Personal Info',
        'Objective',
        'Skills',
        'Experience',
        'Education',
        'Certifications',
        'Hobbies'
    ];

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: field ? { ...prev[section], [field]: value } : value
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        const updatedArray = [...formData[section]];
        updatedArray[index][field] = value;
        setFormData(prev => ({ ...prev, [section]: updatedArray }));
    };

    const addArrayItem = (section, emptyItem) => {
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], emptyItem]
        }));
    };

    const removeArrayItem = (section, index) => {
        if (formData[section].length > 1) {
            const updatedArray = formData[section].filter((_, i) => i !== index);
            const handleChange = (section, field, value, idx) => {
                if (Array.isArray(formData[section])) {
                    const updated = formData[section].map((item, i) =>
                        i === idx ? { ...item, [field]: value } : item
                    );
                    setFormData({ ...formData, [section]: updated });
                } else if (section === 'skills') {
                    setFormData({ ...formData, skills: { ...formData.skills, [field]: value.split(',').map(s => s.trim()) } });
                } else {
                    setFormData({ ...formData, [field]: value });
                }
            };
            setFormData(prev => ({ ...prev, [section]: updatedArray }));
        }
    };

    const { user } = useAuth();

    // Load any saved draft from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('resumeData');
            if (saved) {
                const parsed = JSON.parse(saved);
                // merge saved values with defaults to avoid missing keys
                setFormData(prev => ({ ...prev, ...parsed }));
            }
        } catch (err) {
            console.warn('Failed to load saved resumeData', err);
        }
    }, []);

    // Persist form data to localStorage whenever it changes (draft autosave)
    useEffect(() => {
        try {
            localStorage.setItem('resumeData', JSON.stringify(formData));
        } catch (err) {
            console.warn('Failed to autosave resumeData', err);
        }
    }, [formData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save locally for backward compatibility
        localStorage.setItem('resumeData', JSON.stringify(formData));
        // immediately proceed to template selection so UI doesn't jump unexpectedly
        navigate('/resume/templates');

        // Async persistence & verification prompts (background)
        (async () => {
            try {
                if (user && user.uid) {
                    if (user.email && user.emailVerified === false) {
                        // non-blocking warning instead of forcing navigation
                        window.alert('Email not verified. You can verify from your account page to enable saving to Firestore.');
                    } else {
                        await saveResumeForUser(user.uid, formData, { name: formData.personalInfo.fullName || 'Untitled Resume' });
                    }
                } else {
                    // unauthenticated, just warn user
                    console.log('User not signed in; resume saved locally only.');
                }
            } catch (err) {
                console.warn('Failed to save resume to Firestore', err);
            }
        })();
    };

    const [enhancing, setEnhancing] = useState(null);

    const handleEnhance = async (index) => {
        const bullet = formData.experience[index].description;
        if (!bullet) return;

        setEnhancing(index);
        const enhanced = await enhanceResumeBullet(formData.experience[index].role || 'Professional', bullet);
        handleArrayChange('experience', index, 'description', enhanced);
        setEnhancing(null);
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'Personal Info':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-section">
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" value={formData.personalInfo.fullName} onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)} placeholder="Jane Doe" />
                        </div>
                        <div className="input-grid">
                            <div className="input-group">
                                <label>Email</label>
                                <input type="email" value={formData.personalInfo.email} onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} placeholder="jane@example.com" />
                            </div>
                            <div className="input-group">
                                <label>Phone</label>
                                <input type="tel" value={formData.personalInfo.phone} onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)} placeholder="+1 234 567 890" />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Location</label>
                            <input type="text" value={formData.personalInfo.location} onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)} placeholder="New York, USA" />
                        </div>
                    </motion.div>
                );
            case 'Objective':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-section">
                        <div className="input-group">
                            <label>Professional Objective</label>
                            <textarea value={formData.objective} onChange={(e) => handleInputChange('objective', null, e.target.value)} placeholder="Highly motivated professional seeking..." rows="5"></textarea>
                        </div>
                    </motion.div>
                );
            case 'Skills':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-section">
                        <div className="input-group">
                            <label>Technical Skills (comma separated)</label>
                            <input type="text" value={formData.skills.technical} onChange={(e) => handleInputChange('skills', 'technical', e.target.value)} placeholder="React, Node.js, Python..." />
                        </div>
                        <div className="input-group">
                            <label>Soft Skills (comma separated)</label>
                            <input type="text" value={formData.skills.soft} onChange={(e) => handleInputChange('skills', 'soft', e.target.value)} placeholder="Leadership, Communication, Problem Solving..." />
                        </div>
                    </motion.div>
                );
            case 'Experience':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-section">
                        {formData.experience.map((exp, index) => (
                            <div key={index} className="array-item">
                                <div className="input-grid">
                                    <div className="input-group">
                                        <label>Company</label>
                                        <input type="text" value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <label>Role</label>
                                        <input type="text" value={exp.role} onChange={(e) => handleArrayChange('experience', index, 'role', e.target.value)} />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Duration</label>
                                    <input type="text" value={exp.duration} onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)} placeholder="Jan 2020 - Present" />
                                </div>
                                <div className="input-group">
                                    <label className="label-with-action">
                                        Description
                                        <button
                                            type="button"
                                            className="enhance-btn"
                                            onClick={() => handleEnhance(index)}
                                            disabled={enhancing === index}
                                        >
                                            {enhancing === index ? '✨ Enhancing...' : '✨ AI Optimize'}
                                        </button>
                                    </label>
                                    <textarea value={exp.description} onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}></textarea>
                                </div>
                                <button type="button" className="remove-btn" onClick={() => removeArrayItem('experience', index)}>Remove</button>
                            </div>
                        ))}
                        <button type="button" className="add-btn" onClick={() => addArrayItem('experience', { company: '', role: '', duration: '', description: '' })}>+ Add Experience</button>
                    </motion.div>
                );
            case 'Education':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-section">
                        {formData.education.map((edu, index) => (
                            <div key={index} className="array-item">
                                <div className="input-grid">
                                    <div className="input-group">
                                        <label>School/University</label>
                                        <input type="text" value={edu.school} onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <label>Degree</label>
                                        <input type="text" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Year</label>
                                    <input type="text" value={edu.year} onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)} />
                                </div>
                                <button type="button" className="remove-btn" onClick={() => removeArrayItem('education', index)}>Remove</button>
                            </div>
                        ))}
                        <button type="button" className="add-btn" onClick={() => addArrayItem('education', { school: '', degree: '', year: '' })}>+ Add Education</button>
                    </motion.div>
                );
            case 'Certifications':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-section">
                        <div className="input-group">
                            <label>Certifications (comma separated)</label>
                            <textarea value={formData.certifications} onChange={(e) => handleInputChange('certifications', null, e.target.value)} placeholder="AWS Certified, Google Data Analytics..." rows="4"></textarea>
                        </div>
                    </motion.div>
                );
            case 'Hobbies':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-section">
                        <div className="input-group">
                            <label>Hobbies & Interests</label>
                            <textarea value={formData.hobbies} onChange={(e) => handleInputChange('hobbies', null, e.target.value)} placeholder="Photography, Traveling, Coding..." rows="4"></textarea>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="resume-form-page">
            <div className="form-container glass-card">
                <header className="form-header">
                    <h1>Resume <span className="gradient-text">Builder</span></h1>
                    <p>Fill out all sections to generate your professional resume.</p>
                </header>

                <div className="form-layout">
                    <aside className="form-sidebar">
                        {sections.map(section => (
                            <button
                                key={section}
                                className={`sidebar-tab ${activeSection === section ? 'active' : ''}`}
                                onClick={() => setActiveSection(section)}
                            >
                                {section}
                            </button>
                        ))}
                    </aside>

                    <main className="form-content">
                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {renderSection()}
                            </AnimatePresence>

                            <div className="form-actions">
                                {activeSection !== 'Personal Info' && (
                                    <button type="button" className="back-btn" onClick={() => setActiveSection(sections[sections.indexOf(activeSection) - 1])}>
                                        Previous
                                    </button>
                                )}

                                {activeSection === 'Hobbies' ? (
                                    <button type="submit" className="submit-btn">
                                        Generate Resume
                                    </button>
                                ) : (
                                    <button type="button" className="next-btn" onClick={() => setActiveSection(sections[sections.indexOf(activeSection) + 1])}>
                                        Next Section
                                    </button>
                                )}
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ResumeForm;
