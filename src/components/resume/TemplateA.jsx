
const TemplateA = ({ data, accentColor = '#1a237e', accentTextColor = '#ffffff' }) => {
    const headerStyle = { borderBottom: `2px solid ${accentColor}`, paddingBottom: 20, marginBottom: 20 };
    return (
        <div className="resume-layout template-a" style={{ '--accent-color': accentColor }}>
            <header className="resume-header" style={headerStyle}>
                <h1 style={{ color: accentTextColor }}>{data.personalInfo.fullName}</h1>
                <div className="contact-info" style={{ color: '#555' }}>
                    <span>{data.personalInfo.email}</span> | <span>{data.personalInfo.phone}</span> | <span>{data.personalInfo.location}</span>
                </div>
            </header>

            <section className="resume-section">
                <h3 style={{ borderBottom: `1px solid ${accentColor}`, paddingBottom: 5, marginBottom: 15 }}>Objective</h3>
                <p style={{ color: '#333' }}>{data.objective}</p>
            </section>

            <div className="resume-grid">
                <div className="main-col">
                    <section className="resume-section">
                        <h3>Experience</h3>
                        {data.experience && data.experience.map((exp, i) => (
                            <div key={i} className="entry">
                                <div className="entry-header">
                                    <strong>{exp.role}</strong>
                                    <span style={{ float: 'right' }}>{exp.duration}</span>
                                </div>
                                <em>{exp.company}</em>
                                <p>{exp.description}</p>
                            </div>
                        ))}
                    </section>

                    <section className="resume-section">
                        <h3>Education</h3>
                        {data.education && data.education.map((edu, i) => (
                            <div key={i} className="entry">
                                <div className="entry-header">
                                    <strong>{edu.degree}</strong>
                                    <span style={{ float: 'right' }}>{edu.start} - {edu.end}</span>
                                </div>
                                <em>{edu.institution}</em>
                                <span>{edu.location}</span>
                                <span>{edu.score}</span>
                            </div>
                        ))}
                    </section>

                    <section className="resume-section">
                        <h3>Certifications</h3>
                        {data.certifications && data.certifications.map((cert, i) => (
                            <div key={i} className="entry">
                                <strong>{cert.name}</strong> <span style={{ float: 'right' }}>{cert.year}</span>
                                <em>{cert.platform}</em>
                            </div>
                        ))}
                    </section>

                    <section className="resume-section">
                        <h3>Projects</h3>
                        {data.projects && data.projects.map((proj, i) => (
                            <div key={i} className="entry">
                                <strong>{proj.name}</strong> <span style={{ float: 'right' }}>{proj.year}</span>
                                {proj.org && <em>{proj.org}</em>}
                            </div>
                        ))}
                    </section>
                </div>
                <div className="side-col">
                    <section className="resume-section">
                        <h3>Skills</h3>
                        <div className="skills-list">
                            <strong>Technical:</strong> {data.skills && data.skills.technical && data.skills.technical.join(', ')}<br />
                            <strong>Soft:</strong> {data.skills && data.skills.soft && data.skills.soft.join(', ')}
                        </div>
                    </section>
                    <section className="resume-section">
                        <h3>Languages</h3>
                        <div className="languages-list">
                            {data.languages && data.languages.join(', ')}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TemplateA;
