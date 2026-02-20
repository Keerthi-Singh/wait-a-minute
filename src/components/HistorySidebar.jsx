import React, { useEffect, useState } from 'react';
import './HistorySidebar.css';
import { useAuth } from '../contexts/AuthContext';
import { listenToAnalyses } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

const HistorySidebar = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.uid) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = listenToAnalyses(user.uid, (list) => {
      setItems(list);
      setLoading(false);
    }, (err) => {
      setError(err.message || String(err));
      setLoading(false);
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [user]);

  const handleClick = (item) => {
    setSelected(item.id);
    // Write to localStorage in the shape Result expects
    const payload = item.result || item;
    localStorage.setItem('careerResult', JSON.stringify(payload));
    navigate('/result');
  };

  return (
    <aside className="history-sidebar">
      <div className="history-header">History</div>
      {loading && <div className="history-loading">Loading…</div>}
      {error && <div className="history-error">{error}</div>}
      <div className="history-list">
        {items.map(item => (
          <button key={item.id} className={`history-item ${selected === item.id ? 'selected' : ''}`} onClick={() => handleClick(item)}>
            <div className="history-title">{item.name || item.result?.career || 'Untitled Analysis'}</div>
            <div className="history-date">{item.createdAt && item.createdAt.toDate ? item.createdAt.toDate().toLocaleString() : ''}</div>
          </button>
        ))}
        {!loading && items.length === 0 && <div className="history-empty">No history yet — run the Analyzer</div>}
      </div>
    </aside>
  );
};

export default HistorySidebar;
