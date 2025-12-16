import React, { useState } from 'react';
import { log } from '../../utils/logger';

const PortChecker = () => {
    const [ports, setPorts] = useState({
        80: { status: '--', class: '' },
        443: { status: '--', class: '' },
        21: { status: '--', class: '' },
        22: { status: '--', class: '' }
    });
    const [loading, setLoading] = useState(false);

    const checkPort = async (url) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            await fetch(url, {
                method: 'HEAD',
                mode: 'no-cors',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return { status: 'Open', class: 'open' };
        } catch (error) {
            if (error.name === 'AbortError') {
                return { status: 'Timeout', class: 'closed' };
            } else {
                // Network error usually means closed or blocked
                return { status: 'Unknown', class: '' };
            }
        }
    };

    const runCheck = async () => {
        setLoading(true);
        log('Port Check Started', {}, 'info');

        // Reset
        setPorts({
            80: { status: '--', class: '' },
            443: { status: '--', class: '' },
            21: { status: '--', class: '' },
            22: { status: '--', class: '' }
        });

        try {
            // Check 80
            const res80 = await checkPort('http://portquiz.net:80/');
            setPorts(prev => ({ ...prev, 80: res80 }));

            // Check 443
            const res443 = await checkPort('https://portquiz.net:443/');
            setPorts(prev => ({ ...prev, 443: res443 }));

            // Simulate 21 and 22 as per original code logic (visual simulation mainly)
            setTimeout(() => {
                setPorts(prev => ({ ...prev, 21: { status: 'N/A', class: '' } }));
            }, 1000);

            setTimeout(() => {
                setPorts(prev => ({ ...prev, 22: { status: 'N/A', class: '' } }));
            }, 1500);

            log('Port Check Completed', {}, 'success');

        } catch (error) {
            console.error(error);
            log('Port Check Error', { error: error.message }, 'error');
        } finally {
            setTimeout(() => setLoading(false), 2000);
        }
    };

    return (
        <div className="tool-card" id="portCard">
            <div className="tool-icon">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
            <h3>Port Checker</h3>
            <p>Check if common ports are accessible</p>
            <div className="tool-content">
                <div className="port-grid">
                    <div className="port-item">
                        <span>HTTP (80)</span>
                        <span className={`port-status ${ports[80].class}`}>{ports[80].status}</span>
                    </div>
                    <div className="port-item">
                        <span>HTTPS (443)</span>
                        <span className={`port-status ${ports[443].class}`}>{ports[443].status}</span>
                    </div>
                    <div className="port-item">
                        <span>FTP (21)</span>
                        <span className={`port-status ${ports[21].class}`}>{ports[21].status}</span>
                    </div>
                    <div className="port-item">
                        <span>SSH (22)</span>
                        <span className={`port-status ${ports[22].class}`}>{ports[22].status}</span>
                    </div>
                </div>
                <button className="btn-test" onClick={runCheck} disabled={loading}>
                    {loading ? <span className="loading"></span> : <span>Check Ports</span>}
                </button>
            </div>
        </div>
    );
};

export default PortChecker;
