import React, { useState } from 'react';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import TemplateSelect from './TemplateSelect';
import './ResumeGenerator.css';

const defaultColor = '#1a237e'; // Professional blue

const ResumeGenerator = () => {
  const [resumeData, setResumeData] = useState({});
  const [accentColor, setAccentColor] = useState(defaultColor);

  return (
    <div className="resume-generator-container">
      <TemplateSelect accentColor={accentColor} setAccentColor={setAccentColor} />
      <div className="resume-main">
        <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
        <ResumePreview resumeData={resumeData} accentColor={accentColor} />
      </div>
    </div>
  );
};

export default ResumeGenerator;
