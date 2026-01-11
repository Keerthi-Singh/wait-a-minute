import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Analyzer from './pages/Analyzer'
import Result from './pages/Result'
import './index.css'

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/analyzer" element={<Analyzer />} />
                <Route path="/result" element={<Result />} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <div className="app-container">
                <AnimatedRoutes />
            </div>
        </Router>
    )
}

export default App
