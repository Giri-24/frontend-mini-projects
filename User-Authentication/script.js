const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false
}));

const USERS_FILE = './users.json';

// Helper: load users
function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Helper: save users
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Middleware: check auth
function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.redirect('/login');
}

// Serve pages
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views/register.html')));
app.get('/dashboard', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'views/dashboard.html')));

// Register logic
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

    const userExists = users.find(u => u.username === username);
    if (userExists) return res.send('User already exists.');

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword, role: "user" });
    saveUsers(users);

    res.redirect('/login');
});

// Login logic
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.send('Invalid credentials');
    }

    req.session.user = { username: user.username, role: user.role };
    res.redirect('/dashboard');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
