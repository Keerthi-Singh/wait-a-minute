import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import PrivateRoute from './components/PrivateRoute'
import HistorySidebar from './components/HistorySidebar'
import Analyzer from './pages/Analyzer'
import Result from './pages/Result'
import ResumeForm from './pages/resume/ResumeForm'
import TemplateSelect from './pages/resume/TemplateSelect'
import ResumePreview from './pages/resume/ResumePreview'
import MyResumes from './pages/resume/MyResumes'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Forgot from './pages/Auth/Forgot'
import VerifyEmail from './pages/Auth/VerifyEmail'
import { useAuth } from './contexts/AuthContext'
import './index.css'

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/analyzer" element={<PrivateRoute><Analyzer /></PrivateRoute>} />
                <Route path="/result" element={<PrivateRoute><Result /></PrivateRoute>} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="/auth/forgot" element={<Forgot />} />
                    <Route path="/auth/verify" element={<VerifyEmail />} />
                <Route path="/resume/form" element={<PrivateRoute><ResumeForm /></PrivateRoute>} />
                <Route path="/resume/templates" element={<PrivateRoute><TemplateSelect /></PrivateRoute>} />
                    <Route path="/resume/preview" element={<PrivateRoute><ResumePreview /></PrivateRoute>} />
                    <Route path="/resume/my" element={<PrivateRoute><MyResumes /></PrivateRoute>} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    const { user, loading } = useAuth();

    if (loading) return null; // or a loader

    // Unauthenticated: show only auth pages (no navbar, no sidebar)
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

    // Authenticated: show full app with navbar and history sidebar
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <div style={{ display: 'flex', gap: 0 }}>
                    <HistorySidebar />
                    <div style={{ flex: 1 }}>
                        <AnimatedRoutes />
                    </div>
                </div>
            </div>
        </Router>
    )
}

export default App
