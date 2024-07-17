const express = require('express');
const mysql = require('mysql2'); // Changed from mysql to mysql2
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Tushant@8853',
    database: 'signuplogin'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.stack);
        return;
    }
    console.log('Connected to database as ID:', connection.threadId);
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
// Example route to fetch all users

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (email.trim() === '' || password.trim() === '') {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    connection.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Error fetching user' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = results[0];
        res.json({ message: 'Login successful', user });
    });
});

app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password || email.trim() === '' || password.trim() === '') {
        return res.status(400).json({ error: 'Name, Email, and Password are required.' });
    }

    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    connection.query(sql, [name, email, password], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Error inserting user' });
        }

        res.json({ message: 'Signup successful', user: { name, email } });
    });
});



app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching users' });
            return;
        }
        res.json(results);
    });
});

// Example route to assign a role to a user
app.post('/api/users/:userId/assign-role/:roleId', (req, res) => {
    const { userId, roleId } = req.params;
    const sql = 'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)';
    connection.query(sql, [userId, roleId], (err, result) => { // Changed db.query to connection.query
        if (err) {
            res.status(500).json({ error: 'Error assigning role' });
            return;
        }
        res.json({ message: 'Role assigned successfully' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
