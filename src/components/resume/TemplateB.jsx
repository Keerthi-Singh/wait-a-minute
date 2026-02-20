import React from 'react';
import './Templates.css';

const TemplateB = ({ data, accentColor = '#1a237e', accentTextColor = '#ffffff' }) => {
    const personal = data?.personalInfo || {};
    const experience = Array.isArray(data?.experience) ? data.experience : [];
    const education = Array.isArray(data?.education) ? data.education : [];
    const skills = data?.skills || { technical: [], soft: [] };
    const technicalDisplay = Array.isArray(skills.technical) ? skills.technical.join(', ') : (skills.technical || '');
    const softDisplay = Array.isArray(skills.soft) ? skills.soft.join(', ') : (skills.soft || '');
    const certifications = data?.certifications || '';
    const certificationsDisplay = Array.isArray(certifications) ? certifications.map(c => typeof c === 'string' ? c : c.name || '').join(', ') : certifications;
    const hobbies = data?.hobbies || '';

    return (
        <div className="resume-layout template-b">
            <div className="sidebar">
                <div className="profile-box">
                    <h2 style={{ color: accentTextColor }}>{personal.fullName || 'Your Name'}</h2>
                    <p>{personal.location || ''}</p>
                </div>

                <section className="side-section">
                    <h4 style={{ color: accentTextColor }}>Contact</h4>
                    {personal.email && <p>{personal.email}</p>}
                    {personal.phone && <p>{personal.phone}</p>}
                </section>

                {(technicalDisplay || softDisplay) && (
                    <section className="side-section">
                        <h4 style={{ color: accentTextColor }}>Skills</h4>
                        {technicalDisplay && <p>{technicalDisplay}</p>}
                        {softDisplay && <p>{softDisplay}</p>}
                    </section>
                )}

                {hobbies && (
                    <section className="side-section">
                        <h4 style={{ color: accentTextColor }}>Hobbies</h4>
                        <p>{hobbies}</p>
                    </section>
                )}
            </div>

            <div className="main-content">
                {data?.objective && (
                    <section className="content-section">
                        <h4 style={{ color: accentTextColor }}>Objective</h4>
                        <p>{data.objective}</p>
                    </section>
                )}

                {experience.length > 0 && (
                    <section className="content-section">
                        <h4 style={{ color: accentTextColor }}>Experience</h4>
                        {experience.map((exp, i) => (
                            <div key={i} className="content-entry">
                                <div className="content-entry-header">
                                    <strong>{exp.role || ''}</strong>
                                    <span>{exp.duration || ''}</span>
                                </div>
                                <span className="company-name">{exp.company || ''}</span>
                                {exp.description && <p>{exp.description}</p>}
                            </div>
                        ))}
                    </section>
                )}

                {education.length > 0 && (
                    <section className="content-section">
                        <h4 style={{ color: accentTextColor }}>Education</h4>
                        {education.map((edu, i) => (
                            <div key={i} className="content-entry">
                                <strong>{edu.degree || ''}</strong>
                                <div className="content-entry-header">
                                    <span>{edu.school || edu.institution || ''}</span>
                                    <span>{edu.year || edu.start || ''}</span>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {certificationsDisplay && (
                    <section className="content-section">
                        <h4 style={{ color: accentTextColor }}>Certifications</h4>
                        <p>{certificationsDisplay}</p>
                    </section>
                )}
            </div>
        </div>
    );
};

export default TemplateB;
