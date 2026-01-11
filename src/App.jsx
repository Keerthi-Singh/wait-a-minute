import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Analyzer from './pages/Analyzer'
import Result from './pages/Result'
import ResumeForm from './pages/resume/ResumeForm'
import TemplateSelect from './pages/resume/TemplateSelect'
import ResumePreview from './pages/resume/ResumePreview'
import './index.css'

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/analyzer" element={<Analyzer />} />
                <Route path="/result" element={<Result />} />
                <Route path="/resume/form" element={<ResumeForm />} />
                <Route path="/resume/templates" element={<TemplateSelect />} />
                <Route path="/resume/preview" element={<ResumePreview />} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <AnimatedRoutes />
            </div>
        </Router>
    )
}

export default App
