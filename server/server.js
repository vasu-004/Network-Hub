const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// 🔴 CHANGE PORT to 8080 (match Docker)
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Serve static files from React build
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
      const user = usersData.users.find(
        u => u.username === username && u.password === password
      );

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

// 🔴 IMPORTANT: React fallback (for browser refresh)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// 🔴 MOST IMPORTANT PART (YOU WERE MISSING THIS)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
