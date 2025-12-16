import React, { useState } from 'react';
import { log } from '../../utils/logger';

const SpeedTest = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState({ download: '--', upload: '--', ping: '--' });

    const testPing = async () => {
        const endpoints = [
            'https://www.google.com/favicon.ico',
            'https://www.cloudflare.com/favicon.ico',
            'https://www.github.com/favicon.ico'
        ];

        const pings = [];

        for (const endpoint of endpoints) {
            const startTime = performance.now();
            try {
                await fetch(endpoint, {
                    method: 'HEAD',
                    mode: 'no-cors',
                    cache: 'no-store'
                });
                const endTime = performance.now();
                pings.push(endTime - startTime);
            } catch (error) {
                console.error('Ping test error:', error);
            }
        }

        if (pings.length > 0) {
            return Math.round(pings.reduce((a, b) => a + b) / pings.length);
        }

        try {
            const startTime = performance.now();
            await fetch('http://ip-api.com/json/');
            const endTime = performance.now();
            return Math.round(endTime - startTime);
        } catch {
            return 0;
        }
    };

    const testDownloadSpeed = async () => {
        const testSizes = [500000, 1000000, 1500000]; // 500KB, 1MB, 1.5MB
        const speeds = [];

        for (const size of testSizes) {
            const startTime = performance.now();

            try {
                const response = await fetch(`https://httpbin.org/bytes/${size}`, {
                    cache: 'no-store'
                });
                const blob = await response.blob();
                const endTime = performance.now();

                const fileSizeBytes = blob.size;
                const durationSeconds = (endTime - startTime) / 1000;
                const bitsLoaded = fileSizeBytes * 8;
                const speedMbps = (bitsLoaded / (1024 * 1024)) / durationSeconds;

                speeds.push(speedMbps);
            } catch (error) {
                console.error('Download test error:', error);
            }
        }

        if (speeds.length > 0) {
            return speeds.reduce((a, b) => a + b) / speeds.length;
        }
        return 0;
    };

    const testUploadSpeed = async () => {
        const uploadData = new Blob([new ArrayBuffer(500000)]); // 500KB
        const startTime = performance.now();

        try {
            await fetch('https://httpbin.org/post', {
                method: 'POST',
                body: uploadData,
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            });

            const endTime = performance.now();
            const durationSeconds = (endTime - startTime) / 1000;
            const uploadSizeBytes = uploadData.size;
            const bitsUploaded = uploadSizeBytes * 8;
            const speedMbps = (bitsUploaded / (1024 * 1024)) / durationSeconds;

            return speedMbps;
        } catch (error) {
            console.error('Upload test error:', error);

            // Fallback
            try {
                const smallData = new Blob([new ArrayBuffer(100000)]); // 100KB
                const startTime2 = performance.now();

                await fetch('https://httpbin.org/post', {
                    method: 'POST',
                    body: smallData
                });

                const endTime2 = performance.now();
                const duration2 = (endTime2 - startTime2) / 1000;
                const bitsUploaded2 = smallData.size * 8;
                const speedMbps2 = (bitsUploaded2 / (1024 * 1024)) / duration2;

                return speedMbps2;
            } catch {
                return 0;
            }
        }
    };

    const runSpeedTest = async () => {
        setLoading(true);
        setResults({ download: '--', upload: '--', ping: '--' });
        log('Speed Test Started', {}, 'info');

        try {
            const ping = await testPing();
            setResults(prev => ({ ...prev, ping: ping }));
            log('Ping Test Completed', { ping: ping + ' ms' }, 'success');

            const download = await testDownloadSpeed();
            setResults(prev => ({ ...prev, download: download.toFixed(2) }));
            log('Download Test Completed', { speed: download.toFixed(2) + ' Mbps' }, 'success');

            const upload = await testUploadSpeed();
            setResults(prev => ({ ...prev, upload: upload.toFixed(2) }));
            log('Upload Test Completed', { speed: upload.toFixed(2) + ' Mbps' }, 'success');

        } catch (error) {
            console.error(error);
            log('Speed Test Failed', { error: error.message }, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tool-card" id="speedTestCard">
            <div className="tool-icon">
                <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
            <h3>Speed Test</h3>
            <p>Test your internet connection speed</p>
            <div className="tool-content">
                <div className="speed-display">
                    <div className="speed-metric">
                        <span className="speed-label">Download</span>
                        <span className="speed-value">{results.download}</span>
                        <span className="speed-unit">Mbps</span>
                    </div>
                    <div className="speed-metric">
                        <span className="speed-label">Upload</span>
                        <span className="speed-value">{results.upload}</span>
                        <span className="speed-unit">Mbps</span>
                    </div>
                    <div className="speed-metric">
                        <span className="speed-label">Ping</span>
                        <span className="speed-value">{results.ping}</span>
                        <span className="speed-unit">ms</span>
                    </div>
                </div>
                <button className="btn-test" onClick={runSpeedTest} disabled={loading}>
                    {loading ? <span className="loading"></span> : <span>Start Test</span>}
                </button>
            </div>
        </div>
    );
};

export default SpeedTest;
