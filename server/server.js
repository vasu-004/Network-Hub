const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// API: Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users.json:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        try {
            const usersData = JSON.parse(data);
            const user = usersData.users.find(u => u.username === username && u.password === password);
            
            if (user) {
                res.json({ 
                    success: true, 
                    user: { 
                        username: user.username, 
                        role: user.role 
                    } 
                });
            } else {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        } catch (parseError) {
            console.error('Error parsing users.json:', parseError);
            res.status(500).json({ error: 'Data error' });
        }
    });
});

// Logs - Concept preservation (though localStorage is client side, let's allow saving to server?)
// App.js used localStorage. We can stick to client-side logs for now as per "concept", but 
// usually moving to backend implies server logs. I'll stick to client-side logs to minimize changes unless requested.

// Handle other routes by serving index.html
app.get('*', (req, res) => {
    // Check if the file exists first, if not send a message or fall back
    const indexPath = path.join(__dirname, '../client/dist/index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.send('Frontend is not built yet. Please run "npm run build" in the client directory.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
