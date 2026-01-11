import React from 'react';
import './Templates.css';

const TemplateC = ({ data }) => {
    return (
        <div className="resume-layout template-c">
            <header className="creative-header">
                <div className="header-top">
                    <h1>{data.personalInfo.fullName}</h1>
                    <div className="creative-contact">
                        <span>{data.personalInfo.email}</span>
                        <span>{data.personalInfo.phone}</span>
                    </div>
                </div>
                <div className="creative-banner">
                    <p>{data.objective}</p>
                </div>
            </header>

            <div className="creative-body">
                <div className="creative-column">
                    <h3 className="creative-title">Professional Path</h3>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="creative-entry">
                            <div className="creative-meta">
                                <strong>{exp.company}</strong>
                                <span>{exp.duration}</span>
                            </div>
                            <h4 className="creative-role">{exp.role}</h4>
                            <p>{exp.description}</p>
                        </div>
                    ))}
                </div>

                <div className="creative-column">
                    <h3 className="creative-title">Education & Other</h3>
                    <div className="creative-group">
                        {data.education.map((edu, i) => (
                            <div key={i} className="creative-entry">
                                <strong>{edu.degree}</strong>
                                <p>{edu.school}, {edu.year}</p>
                            </div>
                        ))}
                    </div>

                    <h3 className="creative-title">Expertise</h3>
                    <div className="creative-skills">
                        <p><strong>Technical:</strong> {data.skills.technical}</p>
                        <p><strong>Soft:</strong> {data.skills.soft}</p>
                    </div>

                    <h3 className="creative-title">Distinctions</h3>
                    <p>{data.certifications}</p>
                </div>
            </div>
        </div>
    );
};

export default TemplateC;
