import React, { useState } from 'react';
import { log } from '../../utils/logger';

const DNSLookup = () => {
    const [domain, setDomain] = useState('');
    const [ip, setIp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLookup = async () => {
        if (!domain) return;
        setLoading(true);
        setError('');
        setIp('');
        log('DNS Lookup Started', { domain }, 'info');

        try {
            const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`, {
                headers: { 'Accept': 'application/dns-json' }
            });

            const data = await response.json();

            if (data.Answer && data.Answer.length > 0) {
                const resultIp = data.Answer[0].data;
                setIp(resultIp);
                log('DNS Lookup Successful', { domain, ip: resultIp }, 'success');
            } else {
                setError('No records found');
                log('DNS Lookup Failed', { domain, reason: 'No records found' }, 'warning');
            }
        } catch (err) {
            console.error('DNS lookup error:', err);
            setError('Lookup failed');
            log('DNS Lookup Error', { domain, error: err.message }, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleLookup();
    };

    return (
        <div className="tool-card" id="dnsCard">
            <div className="tool-icon">
                <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M2 12h20" stroke="currentColor" strokeWidth="2" />
                    <path
                        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                        stroke="currentColor" strokeWidth="2" />
                </svg>
            </div>
            <h3>DNS Lookup</h3>
            <p>Resolve domain names to IP addresses</p>
            <div className="tool-content">
                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Enter domain (e.g., google.com)"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </div>
                {ip && (
                    <div className="info-display">
                        <div className="info-item">
                            <span className="info-label">IP Address:</span>
                            <span className="info-value">{ip}</span>
                        </div>
                    </div>
                )}
                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <button className="btn-test" onClick={handleLookup} disabled={loading}>
                    {loading ? <span className="loading"></span> : <span>Lookup</span>}
                </button>
            </div>
        </div>
    );
};

export default DNSLookup;
