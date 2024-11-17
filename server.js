const express = require('express');
const cors = require('cors');
const path = require("path");
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const session = require('express-session');

const app = express();

// Middleware Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 3600000 }
}));

// Middleware Global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// View Engine dan Static Files
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "views/public/css")));
app.use('/assets', express.static(path.join(__dirname, 'views', 'public', 'assets')));
app.set('views', './views');

app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // Jika menggunakan session
    next();
});

// Middleware Auth
const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Rute
app.get('/', async (req, res) => {
    try {
        // Ambil user dari session, jika ada
        const user = req.session.user || null; // Jika tidak ada session user, maka user adalah null
        // Kirim user ke template
        res.render('welcome', { user }); // Jika user tidak ada, maka tidak perlu kirimkan { name: 'Guest' }
    } catch (err) {
        res.status(500).send('Error loading page');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/signup', (req, res) => {
    res.render('signup');
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.redirect('/');
        }
        res.redirect('/login?logout=success');
    });
});
app.use('/api/auth', authRoutes);

// Server Initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log(`Server is running http://localhost:${PORT}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
