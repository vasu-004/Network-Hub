let activityLog = [];

try {
    const savedLogs = localStorage.getItem('networkHub_logs');
    if (savedLogs) {
        activityLog = JSON.parse(savedLogs);
    }
} catch (e) {
    console.warn('Unable to load logs');
}

export const log = (action, details = {}, level = 'info', user = 'anonymous') => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        action,
        user,
        details,
        userAgent: navigator.userAgent
    };

    activityLog.push(logEntry);

    // Console styling
    const styles = {
        info: 'color: #0ea5e9; font-weight: bold',
        success: 'color: #22c55e; font-weight: bold',
        warning: 'color: #f59e0b; font-weight: bold',
        error: 'color: #ef4444; font-weight: bold'
    };

    console.log(`%c[${level.toUpperCase()}] ${timestamp}`, styles[level] || styles.info);
    console.log(`Action: ${action}`);
    if (Object.keys(details).length > 0) {
        console.log('Details:', details);
    }
    console.log('---');

    // Save
    try {
        localStorage.setItem('networkHub_logs', JSON.stringify(activityLog.slice(-100)));
    } catch (e) {
        console.warn('Unable to save logs');
    }
};

export const exportLogs = () => {
    const logsText = JSON.stringify(activityLog, null, 2);
    const blob = new Blob([logsText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `networkhub_logs_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    log('Logs Exported', { count: activityLog.length }, 'info');
};

if (typeof window !== 'undefined') {
    window.exportLogs = exportLogs;
}
