import React from 'react';

// Minimal resume template (TemplateD) — keeps layout simple and ATS-friendly.
// Accepts a `resume` prop (object) and `accentColor` string for theming.
const TemplateD = ({ resume = {}, accentColor = '#0b71ff' }) => {
	const r = resume || {};
	const personal = r.personalInfo || {};
	const skills = r.skills?.technical ? (Array.isArray(r.skills.technical) ? r.skills.technical : String(r.skills.technical).split(',').map(s => s.trim())) : [];

	return (
		<div className="template-d" style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#111', padding: 20 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<div>
					<h1 style={{ margin: 0, fontSize: 22 }}>{personal.fullName || 'Your Name'}</h1>
					<div style={{ fontSize: 13, color: '#555' }}>{personal.email || ''} {personal.phone ? ` • ${personal.phone}` : ''}</div>
				</div>
				<div style={{ width: 80, height: 8, background: accentColor, borderRadius: 4 }} />
			</div>

			{r.objective ? (
				<section style={{ marginTop: 12 }}>
					<h3 style={{ margin: '8px 0', color: accentColor }}>Objective</h3>
					<p style={{ margin: 0, color: '#333' }}>{r.objective}</p>
				</section>
			) : null}

			{r.experience && r.experience.length > 0 ? (
				<section style={{ marginTop: 14 }}>
					<h3 style={{ margin: '8px 0', color: accentColor }}>Experience</h3>
					<ul style={{ margin: 0, paddingLeft: 16 }}>
						{r.experience.map((e, i) => (
							<li key={i} style={{ marginBottom: 6 }}>
								<strong>{e.role || e.company}</strong> {e.duration ? <span style={{ color: '#666' }}>• {e.duration}</span> : null}
								<div style={{ color: '#333' }}>{e.description}</div>
							</li>
						))}
					</ul>
				</section>
			) : null}

			{skills.length > 0 ? (
				<section style={{ marginTop: 14 }}>
					<h3 style={{ margin: '8px 0', color: accentColor }}>Skills</h3>
					<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
						{skills.map((s, i) => (
							<span key={i} style={{ background: '#f2f6ff', padding: '4px 8px', borderRadius: 6, fontSize: 13 }}>{s}</span>
						))}
					</div>
				</section>
			) : null}
		</div>
	);
};

export default TemplateD;
