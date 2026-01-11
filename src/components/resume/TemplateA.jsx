import React from 'react';
import './Templates.css';

const TemplateA = ({ data }) => {
    return (
        <div className="resume-layout template-a">
            <header className="resume-header">
                <h1>{data.personalInfo.fullName}</h1>
                <div className="contact-info">
                    <span>{data.personalInfo.email}</span> | <span>{data.personalInfo.phone}</span> | <span>{data.personalInfo.location}</span>
                </div>
            </header>

            <section className="resume-section">
                <h3>Objective</h3>
                <p>{data.objective}</p>
            </section>

            <div className="resume-grid">
                <div className="main-col">
                    <section className="resume-section">
                        <h3>Experience</h3>
                        {data.experience.map((exp, i) => (
                            <div key={i} className="entry">
                                <div className="entry-header">
                                    <strong>{exp.role}</strong>
                                    <span>{exp.duration}</span>
                                </div>
                                <em>{exp.company}</em>
                                <p>{exp.description}</p>
                            </div>
                        ))}
                    </section>

                    <section className="resume-section">
                        <h3>Education</h3>
                        {data.education.map((edu, i) => (
                            <div key={i} className="entry">
                                <div className="entry-header">
                                    <strong>{edu.degree}</strong>
                                    <span>{edu.year}</span>
                                </div>
                                <p>{edu.school}</p>
                            </div>
                        ))}
                    </section>
                </div>

                <div className="side-col">
                    <section className="resume-section">
                        <h3>Skills</h3>
                        <div className="skills-list">
                            <strong>Technical:</strong> {data.skills.technical}
                            <br />
                            <strong>Soft:</strong> {data.skills.soft}
                        </div>
                    </section>

                    <section className="resume-section">
                        <h3>Certifications</h3>
                        <p>{data.certifications}</p>
                    </section>

                    <section className="resume-section">
                        <h3>Hobbies</h3>
                        <p>{data.hobbies}</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TemplateA;
