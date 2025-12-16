import React from 'react';

const Location = ({ data, loading }) => {
    return (
        <div className="tool-card" id="locationCard">
            <div className="tool-icon">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
            </div>
            <h3>Location</h3>
            <p>Your approximate geographic location</p>
            <div className="tool-content">
                <div className="info-display">
                    <div className="info-item">
                        <span className="info-label">City:</span>
                        <span className="info-value">{loading ? 'Loading...' : (data?.city || 'Unknown')}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Country:</span>
                        <span className="info-value">{loading ? 'Loading...' : `${data?.country || 'Unknown'} (${data?.countryCode || ''})`}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Coordinates:</span>
                        <span className="info-value">{loading ? 'Loading...' : `${data?.lat || 0}, ${data?.lon || 0}`}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Location;
