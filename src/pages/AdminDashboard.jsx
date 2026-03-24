import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { db } from '../firebase/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { IconUsers, IconCpu, IconGlobe, IconFileText, IconZap, IconMicroscope, IconMap, IconTarget, IconAward, IconBarChart, IconTrendingUp } from '../components/Icons';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [modalType, setModalType] = useState('careers');

    // Form states
    const [formData, setFormData] = useState({});
    const [analytics, setAnalytics] = useState({
        totalUsers: 0,
        totalAnalyses: 0,
        totalThreatScans: 0,
        totalResumes: 0,
        totalIntelligenceScans: 0,
        totalReadinessChecks: 0,
        totalCareerAnalyses: 0,
        heatmapViews: 0,
        topCareer: 'Calculating...',
        commonSkillGap: 'Calculating...',
        systemHealth: 'Stable',
        latency: 0,
        userTrend: '+0%',
        avgThreatScore: 0,
        recentUsers: []
    });

    useEffect(() => {
        fetchData();
        setShowModal(false);
        setEditingItem(null);
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'analytics') {
                const startTime = Date.now();
                try {
                    // 1. Fetch all users (top-level collection — always accessible)
                    const usersSnap = await getDocs(collection(db, 'users'));
                    const totalUsers = usersSnap.size;
                    const usersData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                    console.log('[Admin] Users fetched:', totalUsers);

                    // Get recent users (last 5 sorted by createdAt)
                    const recentUsers = usersData
                        .filter(u => u.createdAt)
                        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                        .slice(0, 5);

                    // 2. Read the stats/counters document (top-level, always accessible)
                    //    This is the PRIMARY source for counts — guaranteed to work
                    let statsFromCounters = {};
                    try {
                        const statsSnap = await getDoc(doc(db, 'stats', 'counters'));
                        if (statsSnap.exists()) {
                            statsFromCounters = statsSnap.data();
                            console.log('[Admin] Stats counters loaded:', statsFromCounters);
                        } else {
                            console.log('[Admin] No stats/counters document yet — counts will come from live queries');
                        }
                    } catch (e) {
                        console.warn('[Admin] Cannot read stats/counters:', e.message);
                    }

                    // 3. Try to fetch detailed analysis data per-user (for top career, skill gaps, etc.)
                    //    This may fail if Firestore rules restrict subcollection reads
                    let allAnalyses = [];
                    let liveAnalysesCount = 0;
                    let liveResumesCount = 0;

                    try {
                        const perUserFetches = usersData.map(async (u) => {
                            const userAnalyses = [];
                            let userResumes = 0;
                            try {
                                const aSnap = await getDocs(collection(db, 'users', u.id, 'analyses'));
                                aSnap.docs.forEach(d => userAnalyses.push(d.data()));
                            } catch (e) { /* skip this user */ }
                            try {
                                const rSnap = await getDocs(collection(db, 'users', u.id, 'resumes'));
                                userResumes = rSnap.size;
                            } catch (e) { /* skip this user */ }
                            return { userAnalyses, userResumes };
                        });

                        const perUserResults = await Promise.all(perUserFetches);
                        perUserResults.forEach(({ userAnalyses, userResumes }) => {
                            allAnalyses = allAnalyses.concat(userAnalyses);
                            liveResumesCount += userResumes;
                        });
                        liveAnalysesCount = allAnalyses.length;
                        console.log('[Admin] Live analyses:', liveAnalysesCount, '| Live resumes:', liveResumesCount);
                    } catch (e) {
                        console.warn('[Admin] Per-user fetch failed:', e.message);
                    }

                    // 4. Fetch AI Threat Usage (top-level collection)
                    let liveThreatScans = 0;
                    let avgThreatScore = 0;
                    try {
                        const threatSnap = await getDocs(collection(db, 'aiThreatUsage'));
                        liveThreatScans = threatSnap.size;
                        const threatData = threatSnap.docs.map(d => d.data());
                        if (threatData.length > 0) {
                            const totalScore = threatData.reduce((sum, t) => sum + (parseFloat(t.score) || 0), 0);
                            avgThreatScore = (totalScore / threatData.length).toFixed(1);
                        }
                    } catch (e) {
                        console.warn('[Admin] Cannot read aiThreatUsage:', e.message);
                    }

                    // 5. Use the BEST available number: max of stats/counters vs live query
                    //    (stats/counters may not exist yet if features were used before counters were added)
                    const totalAnalyses = Math.max(liveAnalysesCount, statsFromCounters.totalAnalyses || 0);
                    const totalResumes = Math.max(liveResumesCount, statsFromCounters.totalResumes || 0);
                    const totalThreatScans = Math.max(liveThreatScans, statsFromCounters.totalThreatScans || 0);

                    // 6. Categorize analyses by type & extract top career
                    let totalIntelligenceScans = Math.max(0, statsFromCounters.totalIntelligenceScans || 0);
                    let totalReadinessChecks = Math.max(0, statsFromCounters.totalReadinessChecks || 0);
                    let totalCareerAnalyses = Math.max(0, statsFromCounters.totalCareerAnalyses || 0);

                    let topCareer = "No Data";
                    let commonSkillGap = "No Data";
                    let matchCount = 0;

                    if (allAnalyses.length > 0) {
                        const careerCounts = {};
                        const skillGaps = {};
                        let liveIntScans = 0, liveReadChecks = 0, liveCareerAns = 0;

                        allAnalyses.forEach(a => {
                            if (a.type === 'intelligence_lab') liveIntScans++;
                            else if (a.type === 'readiness_check') liveReadChecks++;
                            else liveCareerAns++;

                            const title = a.careerTitle 
                                || a.name 
                                || (a.result && a.result.career) 
                                || (a.primaryCareer && a.primaryCareer.title)
                                || (a.result && a.result.primaryCareer && a.result.primaryCareer.title)
                                || (a.result && a.result.topCareer && a.result.topCareer.title)
                                || null;
                            
                            if (title && title !== 'Unknown') {
                                const cleanTitle = title
                                    .replace(/^Intelligence Deep Scan:\s*/i, '')
                                    .replace(/^Readiness:\s*/i, '');
                                careerCounts[cleanTitle] = (careerCounts[cleanTitle] || 0) + 1;
                            }

                            const gaps = a.missingSkills || a.skillsToImprove || (a.result && a.result.missingSkills) || [];
                            gaps.forEach(s => {
                                const skillName = typeof s === 'string' ? s : (s.name || "Unknown");
                                if (skillName !== 'Unknown') {
                                    skillGaps[skillName] = (skillGaps[skillName] || 0) + 1;
                                }
                            });
                        });

                        // Use live breakdown if we got data, otherwise keep stats/counters values
                        if (liveAnalysesCount > 0) {
                            totalIntelligenceScans = Math.max(liveIntScans, totalIntelligenceScans);
                            totalReadinessChecks = Math.max(liveReadChecks, totalReadinessChecks);
                            totalCareerAnalyses = Math.max(liveCareerAns, totalCareerAnalyses);
                        }

                        const sortedCareers = Object.entries(careerCounts).sort((a, b) => b[1] - a[1]);
                        topCareer = sortedCareers[0] ? sortedCareers[0][0] : "No Data";
                        matchCount = sortedCareers[0] ? sortedCareers[0][1] : 0;

                        const sortedGaps = Object.entries(skillGaps).sort((a, b) => b[1] - a[1]);
                        commonSkillGap = sortedGaps[0] ? sortedGaps[0][0] : "No Data";
                    }

                    const latency = Date.now() - startTime;
                    setAnalytics({
                        totalUsers,
                        totalAnalyses,
                        totalThreatScans,
                        totalResumes,
                        totalIntelligenceScans,
                        totalReadinessChecks,
                        totalCareerAnalyses,
                        heatmapViews: statsFromCounters.heatmapViews || 0,
                        topCareer,
                        matchCount,
                        commonSkillGap,
                        avgThreatScore,
                        recentUsers,
                        systemHealth: latency < 3000 ? 'Stable' : 'Degraded',
                        latency,
                        userTrend: totalUsers > 0 ? '+ Active' : 'No Data'
                    });
                } catch (err) {
                    console.error('Analytics fetch error:', err);
                }
                setLoading(false);
                return;
            }

            const collectionName = getCollectionName(activeTab);
            const snap = await getDocs(collection(db, collectionName));
            setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error('Fetch error:', err);
        }
        setLoading(false);
    };

    const getCollectionName = (tab) => {
        switch (tab) {
            case 'users': return 'users';
            case 'careers': return 'careers';
            case 'skills': return 'careerSkills';
            case 'certifications': return 'certifications';
            default: return 'careers';
        }
    };

    // One-time sync: iterate all users, count everything, and write to stats/counters
    const syncStats = async () => {
        if (!window.confirm('This will re-count all data from Firestore and update the stats/counters document. Continue?')) return;
        setLoading(true);
        try {
            const usersSnap = await getDocs(collection(db, 'users'));
            const usersData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

            let totalAnalyses = 0;
            let totalResumes = 0;
            let totalIntelligenceScans = 0;
            let totalReadinessChecks = 0;
            let totalCareerAnalyses = 0;

            for (const u of usersData) {
                try {
                    const aSnap = await getDocs(collection(db, 'users', u.id, 'analyses'));
                    aSnap.docs.forEach(d => {
                        const data = d.data();
                        totalAnalyses++;
                        if (data.type === 'intelligence_lab') totalIntelligenceScans++;
                        else if (data.type === 'readiness_check') totalReadinessChecks++;
                        else totalCareerAnalyses++;
                    });
                } catch (e) { /* skip */ }
                try {
                    const rSnap = await getDocs(collection(db, 'users', u.id, 'resumes'));
                    totalResumes += rSnap.size;
                } catch (e) { /* skip */ }
            }

            let totalThreatScans = 0;
            try {
                const threatSnap = await getDocs(collection(db, 'aiThreatUsage'));
                totalThreatScans = threatSnap.size;
            } catch (e) { /* skip */ }

            // Write the stats/counters document
            const { setDoc: setDocImport } = await import('firebase/firestore');
            const statsRef = doc(db, 'stats', 'counters');
            await setDocImport(statsRef, {
                totalAnalyses,
                totalResumes,
                totalThreatScans,
                totalIntelligenceScans,
                totalReadinessChecks,
                totalCareerAnalyses,
                lastSynced: serverTimestamp()
            }, { merge: true });

            alert(`Stats synced! Analyses: ${totalAnalyses}, Resumes: ${totalResumes}, Threat Scans: ${totalThreatScans}`);
            fetchData(); // refresh
        } catch (err) {
            console.error('Sync error:', err);
            alert('Sync failed: ' + err.message);
        }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const collectionName = getCollectionName(modalType);
        try {
            if (editingItem) {
                const docRef = doc(db, collectionName, editingItem.id);
                await updateDoc(docRef, { ...formData, updatedAt: serverTimestamp() });
            } else {
                await addDoc(collection(db, collectionName), { ...formData, createdAt: serverTimestamp() });
            }
            if (activeTab === modalType) fetchData();
            setShowModal(false);
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

    const openEdit = (item, type = activeTab) => {
        setModalType(type);
        setEditingItem(item);
        setFormData(item);
        setShowModal(true);
    };

    const openAdd = (type = activeTab) => {
        setModalType(type);
        setEditingItem(null);
        setFormData({});
        setShowModal(true);
    };

    const renderHeader = () => (
        <header className="admin-header">
            <div className="header-left" onClick={() => setActiveTab('analytics')} style={{ cursor: 'pointer' }}>
                <h1>Admin Command Center</h1>
                <p>Manage the intelligence engine, users, datasets, and platform statistics</p>
            </div>
            <div className="header-actions">
                <button className="header-btn header-btn-primary" onClick={() => openAdd('careers')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    New Career
                </button>
                <button className="header-btn" onClick={() => setActiveTab('users')} title="View all registered users">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    Users
                </button>
                <button className="header-btn" onClick={fetchData} title="Refresh data">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
                    Refresh
                </button>
            </div>
        </header>
    );

    const renderUsersTable = () => (
        <div className="admin-table-container">
            <div className="table-header-actions">
                <h3>Registered Users ({data.length})</h3>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created At</th>
                        <th>Last Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td style={{ fontWeight: 600 }}>{item.email || 'No email'}</td>
                            <td><span className={`badge ${item.role === 'admin' ? 'risk-high' : 'risk-low'}`}>{item.role || 'student'}</span></td>
                            <td>{item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown'}</td>
                            <td>{item.updatedAt ? new Date(item.updatedAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</td>
                            <td>
                                <button className="delete-icon" onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && <tr><td colSpan="5" className="empty-row">No users found.</td></tr>}
                </tbody>
            </table>
        </div>
    );

    const renderCareersTable = () => (
        <div className="admin-table-container">
            <div className="table-header-actions">
                <h3>Active Career Dataset</h3>
                <button className="add-btn" onClick={() => openAdd('careers')}>+ Add Career</button>
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
                                <button className="edit-icon" onClick={() => openEdit(item, 'careers')}>Edit</button>
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
                <button className="add-btn" onClick={() => openAdd('skills')}>+ Add Skill Weight</button>
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
                                <button className="edit-icon" onClick={() => openEdit(item, 'skills')}>Edit</button>
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
                <button className="add-btn" onClick={() => openAdd('certifications')}>+ Add Certification</button>
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
                                <button className="edit-icon" onClick={() => openEdit(item, 'certifications')}>Edit</button>
                                <button className="delete-icon" onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && <tr><td colSpan="4" className="empty-row">No certifications defined.</td></tr>}
                </tbody>
            </table>
        </div>
    );

    const renderAnalytics = () => {
        // Dynamic recommendation logic based on real data
        const threatRecommendation = analytics.totalThreatScans > 10
            ? `Strong engagement detected. Consider adding a "Save & Track Daily" feature near the AI Threat tool. With ${analytics.totalThreatScans} scans, letting users monitor their Threat Score over time will massively boost retention.`
            : analytics.totalThreatScans > 0
            ? `Users have started using the Threat Scanner (${analytics.totalThreatScans} scans so far). Promote this feature on the homepage and add email alerts for "Weekly AI Threat Updates" to convert one-time users into returning visitors.`
            : `No threat scans recorded yet. Consider adding a prominent CTA on the homepage directing users to the AI Threat Scanner. A/B test positioning it as "Check if AI will replace you" for higher click-through.`;

        const analyzerRecommendation = analytics.totalAnalyses > 10
            ? `${analytics.totalAnalyses} deep AI matches mapped — strong traction. The most frequent career is "${analytics.topCareer}" (${analytics.matchCount} times). Introduce an 'AI Interview Simulator' directly inside the Analyzer results page to capture immediate follow-up engagement.`
            : analytics.totalAnalyses > 0
            ? `${analytics.totalAnalyses} analyses completed. The most popular career path is "${analytics.topCareer}". Consider adding career comparison features and personalized follow-up emails to boost re-engagement.`
            : `No career analyses recorded yet. Ensure the Analyzer quiz flow is visible from the main dashboard. Consider adding a "Quick Match" option that gives instant results in 3 questions to reduce funnel drop-off.`;

        const resumeRecommendation = analytics.totalResumes > 5
            ? `${analytics.totalResumes} resumes generated — users are actively building. Add a "Download as PDF" premium option and "AI Review" feature to monetize this high-intent traffic.`
            : analytics.totalResumes > 0
            ? `${analytics.totalResumes} resume(s) created. Promote the Resume Builder in post-analysis results pages to capture users who just discovered their ideal career path.`
            : `No resumes generated yet. Cross-link the Resume Builder from Career Analysis results with a CTA like "Build your resume for [Career Name] now."`;

        return (
            <div className="analytics-view">
                {/* Primary KPIs */}
                <div className="analytics-section-label">Platform Overview</div>
                <div className="analytics-grid">
                    <div className="analytic-card clickable" onClick={() => setActiveTab('users')} title="Click to view all users">
                        <div className="card-icon icon-indigo"><IconUsers size={22} /></div>
                        <h4>Registered Users</h4>
                        <span className="count">{analytics.totalUsers}</span>
                        <div className="trend-up">Active Database</div>
                    </div>
                    <div className="analytic-card">
                        <div className="card-icon icon-green"><IconCpu size={22} /></div>
                        <h4>AI Matches Conducted</h4>
                        <span className="count">{analytics.totalAnalyses}</span>
                        <div className="trend-up">Total Analyses</div>
                    </div>
                    <div className="analytic-card">
                        <div className="card-icon icon-amber"><IconGlobe size={22} /></div>
                        <h4>AI Threat Checks</h4>
                        <span className="count">{analytics.totalThreatScans}</span>
                        <div className="trend-up">LinkedIn Scanner</div>
                    </div>
                    <div className="analytic-card">
                        <div className="card-icon icon-purple"><IconFileText size={22} /></div>
                        <h4>Resumes Generated</h4>
                        <span className="count">{analytics.totalResumes}</span>
                        <div className="trend-up">Builder Usage</div>
                    </div>
                </div>

                {/* Module Breakdown */}
                <div className="analytics-section-label">Module Breakdown</div>
                <div className="analytics-grid">
                    <div className="analytic-card">
                        <div className="card-icon icon-green"><IconZap size={22} /></div>
                        <h4>Career Analyzer</h4>
                        <span className="count">{analytics.totalCareerAnalyses}</span>
                        <div className="trend-up">Quick Career Matches</div>
                    </div>
                    <div className="analytic-card">
                        <div className="card-icon icon-indigo"><IconMicroscope size={22} /></div>
                        <h4>Intelligence Lab</h4>
                        <span className="count">{analytics.totalIntelligenceScans}</span>
                        <div className="trend-up">Deep Analysis Scans</div>
                    </div>
                    <div className="analytic-card">
                        <div className="card-icon icon-amber"><IconMap size={22} /></div>
                        <h4>Readiness Checks</h4>
                        <span className="count">{analytics.totalReadinessChecks}</span>
                        <div className="trend-up">Journey Mapping</div>
                    </div>
                    <div className="analytic-card">
                        <div className="card-icon icon-rose"><IconTarget size={22} /></div>
                        <h4>Avg Threat Score</h4>
                        <span className="count">{analytics.avgThreatScore > 0 ? `${analytics.avgThreatScore}/10` : 'N/A'}</span>
                        <div className="trend-up">Risk Metric Average</div>
                    </div>
                    <div className="analytic-card">
                        <div className="card-icon icon-green"><IconMap size={22} /></div>
                        <h4>Heatmap Views</h4>
                        <span className="count">{analytics.heatmapViews}</span>
                        <div className="trend-up">Skill Gap Explorer</div>
                    </div>
                </div>

                {/* Insights Row */}
                <div className="analytics-section-label">Intelligence Insights</div>
                <div className="analytics-grid three-col">
                    <div className="analytic-card">
                        <div className="card-icon icon-green"><IconAward size={22} /></div>
                        <h4>Most Popular Career</h4>
                        <span className="count count-sm">{analytics.topCareer}</span>
                        <div className="trend-up">{analytics.matchCount > 0 ? `Matched ${analytics.matchCount} times` : 'Awaiting data'}</div>
                    </div>
                    <div className="analytic-card">
                        <div className="card-icon icon-amber"><IconBarChart size={22} /></div>
                        <h4>Top Skill Gap</h4>
                        <span className="count count-sm">{analytics.commonSkillGap}</span>
                        <div className="trend-up">Most common missing skill</div>
                    </div>
                    <div className="analytic-card">
                        <div className="card-icon icon-indigo"><IconTrendingUp size={22} /></div>
                        <h4>Engagement Ratio</h4>
                        <span className="count count-sm">{analytics.totalUsers > 0 ? `${((analytics.totalAnalyses / analytics.totalUsers) * 100).toFixed(0)}%` : 'N/A'}</span>
                        <div className="trend-up">Analyses per user</div>
                    </div>
                </div>

                {/* AI Usage & Recommendations */}
                <div className="recommendations-container">
                    <div className="recommendations-header">
                        <h3>AI Usage & Feature Recommendations</h3>
                        <p>Based on genuine live traffic data</p>
                    </div>
                    <div className="recommendation-card">
                        <div className="rec-header">
                            <div className="rec-icon"><IconGlobe size={20} /></div>
                            <h4>LinkedIn AI Threat Metric</h4>
                        </div>
                        <div className="rec-body">
                            Users have triggered the LinkedIn Threat Scanner <strong>{analytics.totalThreatScans} time{analytics.totalThreatScans !== 1 ? 's' : ''}</strong>.
                            {analytics.avgThreatScore > 0 && <> Average threat score: <strong>{analytics.avgThreatScore}/10</strong>.</>}
                            <br /><br />
                            <strong>Recommendation:</strong> {threatRecommendation}
                        </div>
                    </div>
                    <div className="recommendation-card">
                        <div className="rec-header">
                            <div className="rec-icon"><IconCpu size={20} /></div>
                            <h4>Career Analyzer Activity</h4>
                        </div>
                        <div className="rec-body">
                            {analyzerRecommendation}
                        </div>
                    </div>
                    <div className="recommendation-card">
                        <div className="rec-header">
                            <div className="rec-icon"><IconFileText size={20} /></div>
                            <h4>Resume Builder Activity</h4>
                        </div>
                        <div className="rec-body">
                            {resumeRecommendation}
                        </div>
                    </div>
                    <div className="recommendation-card">
                        <div className="rec-header">
                            <div className="rec-icon"><IconBarChart size={20} /></div>
                            <h4>Platform Health Summary</h4>
                        </div>
                        <div className="rec-body">
                            <strong>{analytics.totalUsers}</strong> registered users · <strong>{analytics.totalAnalyses}</strong> total analyses · <strong>{analytics.totalThreatScans}</strong> threat scans · <strong>{analytics.totalResumes}</strong> resumes built.
                            <br /><br />
                            <strong>Recommendation:</strong> {analytics.totalUsers > 0 && analytics.totalAnalyses === 0
                                ? 'Users are signing up but not completing analyses. Add an onboarding wizard or guided first-run experience.'
                                : analytics.totalUsers > 0
                                ? `Healthy engagement ratio: ${((analytics.totalAnalyses / analytics.totalUsers) * 100).toFixed(0)}% of users have completed at least one analysis. Focus on converting the remaining users with email nudges.`
                                : 'No users yet. Focus on launch marketing and social sharing features to drive initial signups.'}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-container">
            <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-brand">
                    <div className="system-orb"></div>
                    <span>WAIT A <span style={{ color: '#6366f1' }}>MINUTE</span></span>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-separator">Overview</div>
                    <button
                        className={activeTab === 'analytics' ? 'active' : ''}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                        <span>System Insights</span>
                    </button>
                    <button
                        className={activeTab === 'users' ? 'active' : ''}
                        onClick={() => setActiveTab('users')}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <span>Manage Users</span>
                    </button>

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
                            {activeTab === 'analytics' && renderAnalytics()}
                            {activeTab === 'users' && renderUsersTable()}
                            {activeTab === 'careers' && renderCareersTable()}
                            {activeTab === 'skills' && renderSkillsTable()}
                            {activeTab === 'certifications' && renderCertsTable()}
                        </>
                    )}
                </div>
            </main>

            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal glass-card">
                        <h2>{editingItem ? 'Edit ' : 'Add New '}{modalType === 'careers' ? 'Career' : modalType === 'skills' ? 'Skill' : 'Certification'}</h2>
                        <form onSubmit={handleSave}>
                            {modalType === 'careers' && (
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
                            {modalType === 'skills' && (
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
