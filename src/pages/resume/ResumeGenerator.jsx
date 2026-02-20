import React, { useState } from 'react';
import ResumeForm from './ResumeForm';
import ResumePreviewLive from './ResumePreviewLive';
import html2pdf from 'html2pdf.js';
import './ResumeGenerator.css';

const defaultColor = '#1a237e'; // Professional blue

const ResumeGenerator = () => {
  // Compute readable text color for a given hex accent (returns dark or light color)
  const getContrastColor = (hex) => {
    if (!hex) return '#000';
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16) / 255;
    const g = parseInt(h.substring(2, 4), 16) / 255;
    const b = parseInt(h.substring(4, 6), 16) / 255;
    // linearize
    const lr = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const lg = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const lb = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    const lum = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb; // relative luminance
    // If accent is light, return dark text; otherwise return white
    return lum > 0.6 ? '#111111' : '#ffffff';
  };
  const [resumeData, setResumeData] = useState({
    personalInfo: {},
    objective: '',
    skills: { technical: [], soft: [] },
    education: [],
    certifications: [],
    internships: [],
    projects: [],
    languages: []
  });
  const [accentColor, setAccentColor] = useState(defaultColor);
  const [selectedTemplate, setSelectedTemplate] = useState('A');

  // Initialize selected template from previous selection (template gallery)
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('selectedTemplate');
      if (saved) setSelectedTemplate(saved);
    } catch (e) {
      // ignore
    }
  }, []);

  const previewRef = React.useRef(null);
  const [isExporting, setIsExporting] = React.useState(false);

  const handleDownload = async () => {
    const el = previewRef.current;
    if (!el) return;
    setIsExporting(true);

    const filename = (resumeData.personalInfo && resumeData.personalInfo.fullName)
      ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      : 'resume.pdf';

    const opt = {
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(el).save();
    } catch (err) {
      console.error('Export failed', err);
    }

    setIsExporting(false);
  };

  return (
    <div className="resume-generator-container">
      <div className="template-picker-inline" style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: 8 }}>Template:</label>
        {['A', 'B', 'C', 'D'].map(t => (
          <button
            key={t}
            onClick={() => { setSelectedTemplate(t); localStorage.setItem('selectedTemplate', t); }}
            style={{
              marginRight: 8,
              padding: '0.4rem 0.7rem',
              borderRadius: 6,
              border: selectedTemplate === t ? `2px solid ${accentColor}` : '1px solid #ddd',
              background: selectedTemplate === t ? accentColor : 'transparent',
              color: selectedTemplate === t ? '#fff' : '#111',
              cursor: 'pointer'
            }}
          >
            {t}
          </button>
        ))}

        <span style={{ marginLeft: 16 }}>
          <label style={{ marginRight: 6 }}>Accent:</label>
          <input type="color" value={accentColor} onChange={e => { setAccentColor(e.target.value); localStorage.setItem('selectedAccent', e.target.value); }} />
        </span>
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="cta-button"
          style={{ marginLeft: 12 }}
        >
          {isExporting ? 'Exporting...' : 'Download PDF'}
        </button>
      </div>

      <div className="resume-main">
        <div style={{ flex: 1 }}>
          <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
        </div>
        <div style={{ width: 820 }}>
          <ResumePreviewLive
            resumeData={resumeData}
            selectedTemplate={selectedTemplate}
            accentColor={accentColor}
            accentTextColor={getContrastColor ? getContrastColor(accentColor) : '#000'}
            previewRef={previewRef}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeGenerator;
