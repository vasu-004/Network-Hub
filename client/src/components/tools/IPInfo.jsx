import React from 'react';

const IPInfo = ({ data, onRefresh, loading }) => {
    return (
        <div className="tool-card" id="ipCard">
            <div className="tool-icon">
                <svg viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
            <h3>My IP Address</h3>
            <p>View your public IP information</p>
            <div className="tool-content">
                <div className="info-display">
                    <div className="info-item">
                        <span className="info-label">IPv4:</span>
                        <span className="info-value">{loading ? 'Loading...' : (data?.query || 'Unable to detect')}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">ISP:</span>
                        <span className="info-value">{loading ? 'Loading...' : (data?.isp || data?.org || 'Unknown ISP')}</span>
                    </div>
                </div>
                <button className="btn-test" onClick={onRefresh} disabled={loading}>
                    <span>Refresh</span>
                </button>
            </div>
        </div>
    );
};

export default IPInfo;
