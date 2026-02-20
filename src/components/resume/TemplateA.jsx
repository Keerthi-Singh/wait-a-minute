import './Templates.css';

const TemplateA = ({ data, accentColor = '#1a237e', accentTextColor = '#ffffff' }) => {
    const personal = data?.personalInfo || {};
    const experience = Array.isArray(data?.experience) ? data.experience : [];
    const education = Array.isArray(data?.education) ? data.education : [];
    const certifications = Array.isArray(data?.certifications) ? data.certifications : [];
    const projects = Array.isArray(data?.projects) ? data.projects : [];
    const skills = data?.skills || { technical: [], soft: [] };
    const technicalSkills = Array.isArray(skills.technical) ? skills.technical : (typeof skills.technical === 'string' ? skills.technical.split(',').map(s => s.trim()).filter(Boolean) : []);
    const softSkills = Array.isArray(skills.soft) ? skills.soft : (typeof skills.soft === 'string' ? skills.soft.split(',').map(s => s.trim()).filter(Boolean) : []);
    const languages = Array.isArray(data?.languages) ? data.languages : [];

    const headerStyle = { borderBottom: `2px solid ${accentColor}`, paddingBottom: 20, marginBottom: 20 };
    return (
        <div className="resume-layout template-a" style={{ '--accent-color': accentColor }}>
            <header className="resume-header" style={headerStyle}>
                <h1 style={{ color: accentTextColor }}>{personal.fullName || 'Your Name'}</h1>
                <div className="contact-info" style={{ color: '#555' }}>
                    {personal.email && <span>{personal.email}</span>}
                    {personal.email && personal.phone && ' | '}
                    {personal.phone && <span>{personal.phone}</span>}
                    {(personal.email || personal.phone) && personal.location && ' | '}
                    {personal.location && <span>{personal.location}</span>}
                </div>
            </header>

            {data?.objective && (
                <section className="resume-section">
                    <h3 style={{ borderBottom: `1px solid ${accentColor}`, paddingBottom: 5, marginBottom: 15 }}>Objective</h3>
                    <p style={{ color: '#333' }}>{data.objective}</p>
                </section>
            )}

            <div className="resume-grid">
                <div className="main-col">
                    {experience.length > 0 && (
                        <section className="resume-section">
                            <h3>Experience</h3>
                            {experience.map((exp, i) => (
                                <div key={i} className="entry">
                                    <div className="entry-header">
                                        <strong>{exp.role || ''}</strong>
                                        <span style={{ float: 'right' }}>{exp.duration || ''}</span>
                                    </div>
                                    <em>{exp.company || ''}</em>
                                    {exp.description && <p>{exp.description}</p>}
                                </div>
                            ))}
                        </section>
                    )}

                    {education.length > 0 && (
                        <section className="resume-section">
                            <h3>Education</h3>
                            {education.map((edu, i) => (
                                <div key={i} className="entry">
                                    <div className="entry-header">
                                        <strong>{edu.degree || ''}</strong>
                                        <span style={{ float: 'right' }}>
                                            {edu.start || edu.year || ''}{edu.end ? ` - ${edu.end}` : ''}
                                        </span>
                                    </div>
                                    <em>{edu.institution || edu.school || ''}</em>
                                    {edu.location && <span> {edu.location}</span>}
                                    {edu.score && <span> | {edu.score}</span>}
                                </div>
                            ))}
                        </section>
                    )}

                    {certifications.length > 0 && (
                        <section className="resume-section">
                            <h3>Certifications</h3>
                            {certifications.map((cert, i) => (
                                <div key={i} className="entry">
                                    <strong>{typeof cert === 'string' ? cert : cert.name || ''}</strong>
                                    {cert.year && <span style={{ float: 'right' }}>{cert.year}</span>}
                                    {cert.platform && <em>{cert.platform}</em>}
                                </div>
                            ))}
                        </section>
                    )}

                    {projects.length > 0 && (
                        <section className="resume-section">
                            <h3>Projects</h3>
                            {projects.map((proj, i) => (
                                <div key={i} className="entry">
                                    <strong>{proj.name || ''}</strong> <span style={{ float: 'right' }}>{proj.year || ''}</span>
                                    {proj.org && <em>{proj.org}</em>}
                                </div>
                            ))}
                        </section>
                    )}
                </div>
                <div className="side-col">
                    {(technicalSkills.length > 0 || softSkills.length > 0) && (
                        <section className="resume-section">
                            <h3>Skills</h3>
                            <div className="skills-list">
                                {technicalSkills.length > 0 && <><strong>Technical:</strong> {technicalSkills.join(', ')}<br /></>}
                                {softSkills.length > 0 && <><strong>Soft:</strong> {softSkills.join(', ')}</>}
                            </div>
                        </section>
                    )}
                    {languages.length > 0 && (
                        <section className="resume-section">
                            <h3>Languages</h3>
                            <div className="languages-list">
                                {languages.join(', ')}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TemplateA;
