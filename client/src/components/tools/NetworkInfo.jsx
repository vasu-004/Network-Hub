import React, { useEffect, useState } from 'react';
import { log } from '../../utils/logger';

const NetworkInfo = () => {
    const [info, setInfo] = useState({ connection: 'Loading...', browser: 'Loading...', platform: 'Loading...' });

    useEffect(() => {
        const userAgent = navigator.userAgent;
        let browser = 'Unknown';

        if (userAgent.includes('Firefox')) {
            browser = 'Mozilla Firefox';
        } else if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
            browser = 'Google Chrome';
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
            browser = 'Safari';
        } else if (userAgent.includes('Edg')) {
            browser = 'Microsoft Edge';
        } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
            browser = 'Opera';
        }

        const platform = navigator.platform || 'Unknown';

        let connectionType = 'Not available';
        // @ts-ignore
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            connectionType = (connection.effectiveType || connection.type || 'Unknown').toUpperCase();
        }

        setInfo({
            browser,
            platform,
            connection: connectionType
        });

        log('Network Info Loaded', { browser, platform, connection: connectionType }, 'info');
    }, []);

    return (
        <div className="tool-card" id="networkCard">
            <div className="tool-icon">
                <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4M8 15h.01M12 15h.01M16 15h.01" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
            <h3>Network Info</h3>
            <p>Browser and connection details</p>
            <div className="tool-content">
                <div className="info-display">
                    <div className="info-item">
                        <span className="info-label">Connection:</span>
                        <span className="info-value">{info.connection}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Browser:</span>
                        <span className="info-value">{info.browser}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Platform:</span>
                        <span className="info-value">{info.platform}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NetworkInfo;
