import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import PrivateRoute from './components/PrivateRoute'
import HistorySidebar from './components/HistorySidebar'
import Analyzer from './pages/Analyzer'
import Result from './pages/Result'
import IntelligenceLab from './pages/IntelligenceLab'
import IntelligenceResult from './pages/IntelligenceResult'
import ReadinessCheck from './pages/ReadinessCheck'
import ReadinessResult from './pages/ReadinessResult'
import ResumeForm from './pages/resume/ResumeForm'
import TemplateSelect from './pages/resume/TemplateSelect'
import ResumePreview from './pages/resume/ResumePreview'
import AIThreatIndex from './pages/AIThreatIndex'
import LoadingGate from './components/LoadingGate'

import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Forgot from './pages/Auth/Forgot'
import VerifyEmail from './pages/Auth/VerifyEmail'
import AdminDashboard from './pages/AdminDashboard'
import { useAuth } from './contexts/AuthContext'

function AnimatedRoutes() {
    const location = useLocation();
    const { role } = useAuth();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Common Protected Routes */}
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />

                {/* Student specific or common routes */}
                <Route path="/analyzer" element={<PrivateRoute><Analyzer /></PrivateRoute>} />
                <Route path="/result" element={<PrivateRoute><Result /></PrivateRoute>} />
                <Route path="/intelligence-lab" element={<PrivateRoute><IntelligenceLab /></PrivateRoute>} />
                <Route path="/intelligence-result" element={<PrivateRoute><IntelligenceResult /></PrivateRoute>} />
                <Route path="/readiness-check" element={<PrivateRoute><ReadinessCheck /></PrivateRoute>} />
                <Route path="/readiness-result" element={<PrivateRoute><ReadinessResult /></PrivateRoute>} />
                <Route path="/ai-threat-index" element={<PrivateRoute><AIThreatIndex /></PrivateRoute>} />

                {/* Resume module */}
                <Route path="/resume/form" element={<PrivateRoute><ResumeForm /></PrivateRoute>} />
                <Route path="/resume/templates" element={<PrivateRoute><TemplateSelect /></PrivateRoute>} />
                <Route path="/resume/preview" element={<PrivateRoute><ResumePreview /></PrivateRoute>} />


                {/* Admin specific routes */}
                {role === 'admin' && (
                    <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                )}

                {/* Auth Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot" element={<Forgot />} />
                <Route path="/auth/verify" element={<VerifyEmail />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    const { user, loading } = useAuth();

    // Show professional loading gate while authenticating or fetching role
    if (loading) {
        return <LoadingGate />;
    }

    if (!user) {
        return (
            <Router>
                <div className="app-container">
                    <AnimatePresence mode="wait">
                        <Routes>
                            <Route path="/auth/login" element={<Login />} />
                            <Route path="/auth/register" element={<Register />} />
                            <Route path="/auth/forgot" element={<Forgot />} />
                            <Route path="/auth/verify" element={<VerifyEmail />} />
                            <Route path="*" element={<Navigate to="/auth/login" replace />} />
                        </Routes>
                    </AnimatePresence>
                </div>
            </Router>
        );
    }

    return (
        <Router>
            <AuthContent />
        </Router>
    )
}

function AuthContent() {
    const location = useLocation();
    const { user, role } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Admins don't need the history sidebar on their dashboard
    const isAdminPath = location.pathname.startsWith('/admin');
    const isResumePath = location.pathname.startsWith('/resume');
    const showSidebar = !isAdminPath && !isResumePath && role !== 'admin';

    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="app-container">
            <Navbar
                onToggleSidebar={showSidebar ? toggleSidebar : undefined}
                sidebarOpen={sidebarOpen}
            />
            <div className="app-body">
                {showSidebar && (
                    <HistorySidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                )}
                <div className={`${isAdminPath ? 'admin-body' : 'app-main-content'}`}>
                    <AnimatedRoutes />
                </div>
            </div>
        </div>
    );
}

export default App
