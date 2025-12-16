import React, { useEffect, useState } from 'react';
import { log } from '../utils/logger';
import SpeedTest from './tools/SpeedTest';
import IPInfo from './tools/IPInfo';
import Location from './tools/Location';
import DNSLookup from './tools/DNSLookup';
import NetworkInfo from './tools/NetworkInfo';
import PortChecker from './tools/PortChecker';

const Dashboard = ({ user, onLogout }) => {
    const [ipData, setIpData] = useState(null);
    const [ipLoading, setIpLoading] = useState(false);

    const loadIPInfo = async () => {
        setIpLoading(true);
        log('Loading IP Information', {}, 'info');
        try {
            const response = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,lat,lon,isp,org,as,query');
            const data = await response.json();
            if (data.status === 'success') {
                setIpData(data);
                log('IP Information Loaded', { ip: data.query, location: `${data.city}, ${data.country}`, isp: data.isp }, 'success');
            } else {
                throw new Error(data.message || 'Failed to get IP info');
            }
        } catch (error) {
            console.error('IP info error:', error);
            log('IP Information Load Failed', { error: error.message }, 'error');
            // Fallback
            try {
                const ipResponse = await fetch('https://ipapi.co/json/');
                const ipDataFallback = await ipResponse.json();
                setIpData({
                    query: ipDataFallback.ip,
                    isp: ipDataFallback.org,
                    city: ipDataFallback.city,
                    country: ipDataFallback.country_name,
                    countryCode: ipDataFallback.country_code,
                    lat: ipDataFallback.latitude,
                    lon: ipDataFallback.longitude
                });
                log('IP Information Loaded (Fallback)', {}, 'success');
            } catch (fallbackError) {
                log('All IP APIs Failed', { error: fallbackError.message }, 'error');
            }
        } finally {
            setIpLoading(false);
        }
    };

    useEffect(() => {
        log('Dashboard Loaded', { user: user.username }, 'info');
        loadIPInfo();
    }, [user]);

    return (
        <div id="dashboardPage" className="page active">
            <div className="dashboard-background"></div>

            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-brand">
                        <div className="logo-icon-small">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#grad2)" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round" />
                                <defs>
                                    <linearGradient id="grad2" x1="2" y1="2" x2="22" y2="22">
                                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="1" />
                                        <stop offset="100%" stopColor="#0284c7" stopOpacity="1" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span>NetworkHub</span>
                    </div>
                    <div className="navbar-user">
                        <div className="user-info">
                            <span className="user-name" id="userName">{user.username}</span>
                            <span className="user-status">Online</span>
                        </div>
                        <button className="logout-btn" id="logoutBtn" onClick={() => {
                            log('User Logged Out', { user: user.username }, 'info');
                            onLogout();
                        }}>
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Network Diagnostics</h1>
                    <p>Monitor and test your network performance in real-time</p>
                </div>

                <div className="tools-grid">
                    <SpeedTest />
                    <IPInfo data={ipData} onRefresh={loadIPInfo} loading={ipLoading} />
                    <Location data={ipData} loading={ipLoading} />
                    <DNSLookup />
                    <NetworkInfo />
                    <PortChecker />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
