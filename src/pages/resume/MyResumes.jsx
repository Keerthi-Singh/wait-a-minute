import React, { useEffect, useState } from 'react';
import { getCurrentUser, getResumesForUser, deleteResumeForUser } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import './ResumePreview.css';

const MyResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        if (!user || !user.uid) {
          setResumes([]);
          setLoading(false);
          return;
        }
        const list = await getResumesForUser(user.uid);
        setResumes(list);
      } catch (err) {
        console.error('Failed to load resumes', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLoad = (r) => {
    // Save to localStorage and navigate to templates/preview flow
    localStorage.setItem('resumeData', JSON.stringify(r));
    navigate('/resume/templates');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume?')) return;
    try {
      const user = await getCurrentUser();
      if (!user || !user.uid) return;
      await deleteResumeForUser(user.uid, id);
      setResumes(prev => prev.filter(x => x.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete resume');
    }
  };

  if (loading) return <div className="glass-card" style={{ padding: 20 }}>Loading...</div>;

  return (
    <div className="resume-preview-page">
      <div className="glass-card" style={{ maxWidth: 900, margin: '1rem auto' }}>
        <h2>My Saved Resumes</h2>
        {resumes.length === 0 ? (
          <p>No saved resumes found for this account.</p>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {resumes.map(r => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, background: 'rgba(0,0,0,0.04)' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.meta?.name || r.personalInfo?.fullName || 'Untitled'}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{new Date((r.createdAt && r.createdAt.seconds ? r.createdAt.seconds * 1000 : Date.now())).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleLoad(r)} className="cta-button">Load</button>
                  <button onClick={() => handleDelete(r.id)} className="secondary-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResumes;
