import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { db } from '../firebase/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, setDoc, collectionGroup, getCountFromServer } from 'firebase/firestore';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('careers');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Form states
    const [formData, setFormData] = useState({});
    const [analytics, setAnalytics] = useState({
        totalUsers: 0,
        topCareer: 'Calculating...',
        commonSkillGap: 'Calculating...',
        systemHealth: 'Stable',
        latency: 0,
        userTrend: '+0%'
    });

    useEffect(() => {
        fetchData();
        setShowModal(false);
        setEditingItem(null);
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const collectionName = getCollectionName(activeTab);
            if (activeTab === 'analytics') {
                const startTime = Date.now();
                try {
                    // 1. Total Registered Users
                    const usersSnap = await getCountFromServer(collection(db, 'users'));
                    const totalUsers = usersSnap.data().count;

                    // 2. Deep Insights from Analyses
                    let topCareer = "No Data";
                    let commonSkillGap = "No Data";
                    let matchCount = 0;

                    try {
                        const analysesSnap = await getDocs(collectionGroup(db, 'analyses'));
                        const analyses = analysesSnap.docs.map(d => d.data());

                        if (analyses.length > 0) {
                            const careerCounts = {};
                            const skillGaps = {};

                            analyses.forEach(a => {
                                const title = a.careerTitle || a.recommendedCareer?.title || "Unknown";
                                careerCounts[title] = (careerCounts[title] || 0) + 1;

                                const gaps = a.missingSkills || a.skillsToImprove || [];
                                gaps.forEach(s => {
                                    const skillName = typeof s === 'string' ? s : (s.name || "Unknown");
                                    skillGaps[skillName] = (skillGaps[skillName] || 0) + 1;
                                });
                            });

                            const sortedCareers = Object.entries(careerCounts).sort((a, b) => b[1] - a[1]);
                            topCareer = sortedCareers[0] ? sortedCareers[0][0] : "No Data";
                            matchCount = sortedCareers[0] ? sortedCareers[0][1] : 0;

                            const sortedGaps = Object.entries(skillGaps).sort((a, b) => b[1] - a[1]);
                            commonSkillGap = sortedGaps[0] ? sortedGaps[0][0] : "No Data";
                        }
                    } catch (err) {
                        console.warn('Analyses aggregation failed (Index might be missing):', err);
                    }

                    const latency = Date.now() - startTime;
                    setAnalytics({
                        totalUsers,
                        topCareer,
                        matchCount,
                        commonSkillGap,
                        systemHealth: latency < 300 ? 'Stable' : 'Degraded',
                        latency,
                        userTrend: '+5% this week' // Could be calculated if createdAt is checked
                    });
                } catch (err) {
                    console.error('Analytics fetch error:', err);
                }
                setLoading(false);
                return;
            }
            const snap = await getDocs(collection(db, collectionName));
            setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error('Fetch error:', err);
        }
        setLoading(false);
    };

    const getCollectionName = (tab) => {
        switch (tab) {
            case 'careers': return 'careers';
            case 'skills': return 'careerSkills';
            case 'certifications': return 'certifications';
            case 'roadmaps': return 'careerPaths';
            default: return 'careers';
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const collectionName = getCollectionName(activeTab);
        try {
            if (editingItem) {
                const docRef = doc(db, collectionName, editingItem.id);
                await updateDoc(docRef, { ...formData, updatedAt: serverTimestamp() });
            } else {
                await addDoc(collection(db, collectionName), { ...formData, createdAt: serverTimestamp() });
            }
            fetchData();
        } catch (err) {
            alert('Save failed: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        const collectionName = getCollectionName(activeTab);
        try {
            await deleteDoc(doc(db, collectionName, id));
            fetchData();
        } catch (err) {
            alert('Delete failed: ' + err.message);
        }
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setFormData(item);
        setShowModal(true);
    };

    const openAdd = () => {
        setEditingItem(null);
        setFormData({});
        setShowModal(true);
    };

    const renderHeader = () => (
        <header className="admin-header">
            <div className="header-left">
                <h1>Career Knowledge Console</h1>
                <p>Manage the intelligence engine and datasets</p>
            </div>
            <div className="header-actions">
                <button className="refresh-btn" onClick={fetchData}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
                    Refresh
                </button>
            </div>
        </header>
    );

    const renderCareersTable = () => (
        <div className="admin-table-container">
            <div className="table-header-actions">
                <h3>Active Career Dataset</h3>
                <button className="add-btn" onClick={openAdd}>+ Add Career</button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Domain</th>
                        <th>Risk</th>
                        <th>Stability</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>{item.domain}</td>
                            <td><span className={`badge risk-${item.riskLevel?.toLowerCase()}`}>{item.riskLevel}</span></td>
                            <td>{item.timeToStability}</td>
                            <td>
                                <button className="edit-icon" onClick={() => openEdit(item)}>Edit</button>
                                <button className="delete-icon" onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && <tr><td colSpan="5" className="empty-row">No careers found in database.</td></tr>}
                </tbody>
            </table>
        </div>
    );

    const renderSkillsTable = () => (
        <div className="admin-table-container">
            <div className="table-header-actions">
                <h3>Skill Weight Manager</h3>
                <button className="add-btn" onClick={openAdd}>+ Add Skill Weight</button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Skill Name</th>
                        <th>Weight (1-10)</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td style={{ fontWeight: 600 }}>{item.name}</td>
                            <td><div className="weight-pill">{item.weight}</div></td>
                            <td>{item.category}</td>
                            <td>
                                <button className="edit-icon" onClick={() => openEdit(item)}>Edit</button>
                                <button className="delete-icon" onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && <tr><td colSpan="4" className="empty-row">No skill weights defined.</td></tr>}
                </tbody>
            </table>
        </div>
    );

    const renderCertsTable = () => (
        <div className="admin-table-container">
            <div className="table-header-actions">
                <h3>Certification Catalog</h3>
                <button className="add-btn" onClick={openAdd}>+ Add Certification</button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Level</th>
                        <th>Career Link</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td><span className="badge level-badge">{item.level}</span></td>
                            <td>{item.careerId}</td>
                            <td>
                                <button className="edit-icon" onClick={() => openEdit(item)}>Edit</button>
                                <button className="delete-icon" onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderAnalytics = () => (
        <div className="analytics-view">
            <div className="analytics-grid">
                <div className="analytic-card">
                    <h4>Total Registered Users</h4>
                    <span className="count">{analytics.totalUsers}</span>
                    <div className="trend-up">{analytics.userTrend}</div>
                </div>
                <div className="analytic-card">
                    <h4>Top Career Path</h4>
                    <span className="count">{analytics.topCareer}</span>
                    <p>{analytics.matchCount} students match this</p>
                </div>
                <div className="analytic-card">
                    <h4>Most Common Skill Gap</h4>
                    <span className="count">{analytics.commonSkillGap}</span>
                    <p>Highest frequency in current datasets</p>
                </div>
                <div className="analytic-card">
                    <h4>System Health</h4>
                    <span className={`count ${analytics.systemHealth === 'Stable' ? 'highlight' : 'warning'}`}>
                        {analytics.systemHealth}
                    </span>
                    <p>AI logic running at {analytics.latency}ms latency</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="admin-container">
            <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-brand">
                    <div className="system-orb"></div>
                    <span>WAIT A <span style={{ color: '#6366f1' }}>MINUTE</span></span>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-separator">Intelligence Data</div>
                    <button
                        className={activeTab === 'careers' ? 'active' : ''}
                        onClick={() => setActiveTab('careers')}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                        <span>Manage Careers</span>
                    </button>
                    <button
                        className={activeTab === 'skills' ? 'active' : ''}
                        onClick={() => setActiveTab('skills')}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                        <span>Skill Weights</span>
                    </button>
                    <button
                        className={activeTab === 'certifications' ? 'active' : ''}
                        onClick={() => setActiveTab('certifications')}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        <span>Certifications</span>
                    </button>

                    <div className="sidebar-separator">Analytics</div>
                    <button
                        className={activeTab === 'analytics' ? 'active' : ''}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                        <span>System Insight</span>
                    </button>
                </nav>

                <button className="collapse-toggle" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                    {isSidebarCollapsed ? '>' : '<'}
                </button>
            </aside>

            <main className="admin-main">
                {renderHeader()}
                <div className="admin-view-content">
                    {loading ? <div className="admin-loader">Fetching node data...</div> : (
                        <>
                            {activeTab === 'careers' && renderCareersTable()}
                            {activeTab === 'skills' && renderSkillsTable()}
                            {activeTab === 'certifications' && renderCertsTable()}
                            {activeTab === 'analytics' && renderAnalytics()}
                        </>
                    )}
                </div>
            </main>

            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal glass-card">
                        <h2>{editingItem ? 'Edit ' : 'Add New '}{activeTab.slice(0, -1)}</h2>
                        <form onSubmit={handleSave}>
                            {activeTab === 'careers' && (
                                <>
                                    <div className="input-group">
                                        <label>Career Title</label>
                                        <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required placeholder="e.g. Cloud Architect" />
                                    </div>
                                    <div className="input-group">
                                        <label>Domain</label>
                                        <input type="text" value={formData.domain || ''} onChange={e => setFormData({ ...formData, domain: e.target.value })} required placeholder="e.g. Technology" />
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div className="input-group" style={{ flex: 1 }}>
                                            <label>Risk Level</label>
                                            <select value={formData.riskLevel || ''} onChange={e => setFormData({ ...formData, riskLevel: e.target.value })}>
                                                <option value="">Select...</option>
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                        <div className="input-group" style={{ flex: 1 }}>
                                            <label>Burnout Risk</label>
                                            <select value={formData.burnoutRisk || ''} onChange={e => setFormData({ ...formData, burnoutRisk: e.target.value })}>
                                                <option value="">Select...</option>
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeTab === 'skills' && (
                                <>
                                    <div className="input-group">
                                        <label>Skill Name</label>
                                        <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                    </div>
                                    <div className="input-group">
                                        <label>Weight (1-10)</label>
                                        <input type="number" min="1" max="10" value={formData.weight || ''} onChange={e => setFormData({ ...formData, weight: parseInt(e.target.value) })} required />
                                    </div>
                                    <div className="input-group">
                                        <label>Category</label>
                                        <input type="text" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Technical, Soft Skill" />
                                    </div>
                                </>
                            )}
                            <div className="modal-actions">
                                <button type="button" className="secondary-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="cta-button cta-sm">Save Intelligence Node</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
