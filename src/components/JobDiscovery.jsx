import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getJobInsights } from '../utils/aiService';
import { IconSparkles } from './Icons';
import './JobDiscovery.css';

const JobDiscovery = ({ careerTitle }) => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            setLoading(true);
            const data = await getJobInsights(careerTitle);
            setInsights(data);
            setLoading(false);
        };

        if (careerTitle) {
            fetchInsights();
        }
    }, [careerTitle]);

    // Build direct provider search URLs for a given keyword
    const buildProviderLinks = (keyword) => {
        const q = encodeURIComponent(keyword);
        return {
            google: `https://www.google.com/search?q=${encodeURIComponent(keyword + ' jobs')}&ibp=htl;jobs`,
            indeed: `https://www.indeed.com/jobs?q=${q}&l=`,
            linkedin: `https://www.linkedin.com/jobs/search/?keywords=${q}`,
            glassdoor: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${q}`,
            weworkremotely: `https://weworkremotely.com/remote-jobs/search?term=${q}`
        };
    };

    if (loading) {
        return (
            <div className="job-discovery-loading glass-card">
                <div className="spinner"></div>
                <p>AI is scanning the job market for {careerTitle}...</p>
            </div>
        );
    }

    return (
        <motion.div
            className="job-discovery-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <h2 className="section-title"><IconSparkles size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} /> AI Job Market Insights</h2>

            <div className="discovery-grid">
                <div className="market-overview glass-card">
                    <h3>Market Pulse</h3>
                    <p>{insights.marketOverview}</p>
                    <div className="growth-badge">Projected Growth: {insights.growthRate}</div>
                </div>

                <div className="salary-insights glass-card">
                    <h3>Salary Benchmarks (USD)</h3>
                    <div className="salary-tiers">
                        <div className="tier">
                            <span className="label">Entry Level</span>
                            <span className="amount">${insights.typicalSalaries.entry}</span>
                        </div>
                        <div className="tier">
                            <span className="label">Mid-Level</span>
                            <span className="amount">${insights.typicalSalaries.mid}</span>
                        </div>
                        <div className="tier">
                            <span className="label">Senior</span>
                            <span className="amount">${insights.typicalSalaries.senior}</span>
                        </div>
                    </div>
                </div>

                <div className="hiring-companies glass-card">
                    <h3>Top Hiring Hubs</h3>
                    <div className="company-list">
                        {insights.topCompanies.map((co, idx) => (
                            <span key={idx} className="company-tag">{co}</span>
                        ))}
                    </div>
                </div>

                <div className="job-actions glass-card">
                    <h3>Explore live Openings</h3>
                    <p>Click below to view real-time vacancies on Google Jobs:</p>
                    <div className="search-buttons">
                        {insights.jobSearchKeywords.map((kw, idx) => {
                            const links = buildProviderLinks(kw);
                            return (
                                <div key={idx} className="job-keyword">
                                    <div className="keyword-label">{kw}</div>
                                    <div className="provider-links">
                                        <a href={links.google} target="_blank" rel="noopener noreferrer" className="provider-link">Google Jobs</a>
                                        <a href={links.indeed} target="_blank" rel="noopener noreferrer" className="provider-link">Indeed</a>
                                        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="provider-link">LinkedIn</a>
                                        <a href={links.glassdoor} target="_blank" rel="noopener noreferrer" className="provider-link">Glassdoor</a>
                                        <a href={links.weworkremotely} target="_blank" rel="noopener noreferrer" className="provider-link">WeWorkRemotely</a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default JobDiscovery;
