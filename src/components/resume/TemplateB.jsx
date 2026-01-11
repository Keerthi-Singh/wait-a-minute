import React from 'react';
import './Templates.css';

const TemplateB = ({ data }) => {
    return (
        <div className="resume-layout template-b">
            <div className="sidebar">
                <div className="profile-box">
                    <h2>{data.personalInfo.fullName}</h2>
                    <p>{data.personalInfo.location}</p>
                </div>

                <section className="side-section">
                    <h4>Contact</h4>
                    <p>{data.personalInfo.email}</p>
                    <p>{data.personalInfo.phone}</p>
                </section>

                <section className="side-section">
                    <h4>Skills</h4>
                    <p>{data.skills.technical}</p>
                    <p>{data.skills.soft}</p>
                </section>

                <section className="side-section">
                    <h4>Hobbies</h4>
                    <p>{data.hobbies}</p>
                </section>
            </div>

            <div className="main-content">
                <section className="content-section">
                    <h4>Objective</h4>
                    <p>{data.objective}</p>
                </section>

                <section className="content-section">
                    <h4>Experience</h4>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="content-entry">
                            <div className="content-entry-header">
                                <strong>{exp.role}</strong>
                                <span>{exp.duration}</span>
                            </div>
                            <span className="company-name">{exp.company}</span>
                            <p>{exp.description}</p>
                        </div>
                    ))}
                </section>

                <section className="content-section">
                    <h4>Education</h4>
                    {data.education.map((edu, i) => (
                        <div key={i} className="content-entry">
                            <strong>{edu.degree}</strong>
                            <div className="content-entry-header">
                                <span>{edu.school}</span>
                                <span>{edu.year}</span>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="content-section">
                    <h4>Certifications</h4>
                    <p>{data.certifications}</p>
                </section>
            </div>
        </div>
    );
};

export default TemplateB;
