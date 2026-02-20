import React from 'react';
import './Templates.css';

const TemplateC = ({ data, accentColor = '#1a237e', accentTextColor = '#ffffff' }) => {
    const personal = data?.personalInfo || {};
    const experience = Array.isArray(data?.experience) ? data.experience : [];
    const education = Array.isArray(data?.education) ? data.education : [];
    const skills = data?.skills || { technical: [], soft: [] };
    const technicalDisplay = Array.isArray(skills.technical) ? skills.technical.join(', ') : (skills.technical || '');
    const softDisplay = Array.isArray(skills.soft) ? skills.soft.join(', ') : (skills.soft || '');
    const certifications = data?.certifications || '';
    const certificationsDisplay = Array.isArray(certifications) ? certifications.map(c => typeof c === 'string' ? c : c.name || '').join(', ') : certifications;

    return (
        <div className="resume-layout template-c">
            <header className="creative-header">
                <div className="header-top">
                    <h1 style={{ color: accentTextColor }}>{personal.fullName || 'Your Name'}</h1>
                    <div className="creative-contact">
                        {personal.email && <span>{personal.email}</span>}
                        {personal.phone && <span>{personal.phone}</span>}
                    </div>
                </div>
                {data?.objective && (
                    <div className="creative-banner">
                        <p style={{ borderLeft: `4px solid ${accentColor}`, paddingLeft: '0.6rem', color: '#fff' }}>{data.objective}</p>
                    </div>
                )}
            </header>

            <div className="creative-body">
                <div className="creative-column">
                    {experience.length > 0 && (
                        <>
                            <h3 className="creative-title" style={{ color: accentTextColor }}>Professional Path</h3>
                            {experience.map((exp, i) => (
                                <div key={i} className="creative-entry">
                                    <div className="creative-meta">
                                        <strong>{exp.company || ''}</strong>
                                        <span>{exp.duration || ''}</span>
                                    </div>
                                    <h4 className="creative-role">{exp.role || ''}</h4>
                                    {exp.description && <p>{exp.description}</p>}
                                </div>
                            ))}
                        </>
                    )}
                </div>

                <div className="creative-column">
                    {education.length > 0 && (
                        <>
                            <h3 className="creative-title" style={{ color: accentTextColor }}>Education & Other</h3>
                            <div className="creative-group">
                                {education.map((edu, i) => (
                                    <div key={i} className="creative-entry">
                                        <strong>{edu.degree || ''}</strong>
                                        <p>{edu.school || edu.institution || ''}{edu.year || edu.start ? `, ${edu.year || edu.start}` : ''}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {(technicalDisplay || softDisplay) && (
                        <>
                            <h3 className="creative-title" style={{ color: accentTextColor }}>Expertise</h3>
                            <div className="creative-skills">
                                {technicalDisplay && <p><strong>Technical:</strong> {technicalDisplay}</p>}
                                {softDisplay && <p><strong>Soft:</strong> {softDisplay}</p>}
                            </div>
                        </>
                    )}

                    {certificationsDisplay && (
                        <>
                            <h3 className="creative-title" style={{ color: accentTextColor }}>Distinctions</h3>
                            <p>{certificationsDisplay}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TemplateC;
