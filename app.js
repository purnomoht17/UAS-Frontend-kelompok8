const express = require('express');
const cors = require('cors');
const path = require("path");
const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
require('dotenv').config();
const session = require('express-session');
const app = express();
const Tour = require('./models/tourModel');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk menangani session dan user di setiap request
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 3600000 }
}));

app.use((req, res, next) => {
    if (req.session && req.session.user) {
        req.user = req.session.user; // Menyimpan user dari session untuk digunakan di route
    }
    next();
});

// Menangani user di setiap request (untuk penggunaan di views)
app.use((req, res, next) => {
    res.locals.user = req.session.user || null; 
    next();
});

// Pengaturan view engine dan static files
app.set('view engine', 'ejs');
app.set('views', './views'); // Pastikan direktori views diatur dengan benar
app.use(express.static(path.join(__dirname, "views/public/css")));
app.use('/assets', express.static(path.join(__dirname, 'views', 'public', 'assets')));

// Routes untuk mengelola tour
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);

// Halaman utama yang menampilkan semua tour
app.get('/', async (req, res) => {
    try {
        const tours = await Tour.getAllTours();  // Ambil semua tour dari database
        const user = req.session.user || null; // Ambil user dari session (jika ada)
        res.render('home', { user, tours }); // Render halaman home dengan data user dan tours
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading page');
    }
});

// Route halaman tentang
app.get('/about', (req, res) =>{
    res.render('about');
});

// Route halaman kontak
app.get('/contact', (req, res)=>{
    res.render('contact');
});

// Route halaman subscribe
app.get('/subscribe', (req, res)=>{
    res.render('subscribe');
});

// Route login
app.get('/login', (req, res) => {
    res.render('login');
});

// Route signup
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Route untuk melihat detail tour
app.get('/tours/:id', async (req, res) => {
    try {
        const tourId = req.params.id; // Mengambil ID dari URL parameter
        const tour = await Tour.getTourById(tourId); // Menggunakan getTourById untuk mengambil detail tour berdasarkan ID

        if (!tour) {
            return res.status(404).send('Tour not found'); // Jika tour tidak ditemukan
        }

        // Render halaman detail tour menggunakan template article.ejs
        res.render('articles', { tour });
    } catch (error) {
        console.error('Error fetching tour:', error);
        res.status(500).send('Error fetching tour');
    }
});

// Route logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.redirect('/');
        }
        res.redirect('/login?logout=success');
    });
});

// Menjalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    try {
        console.log(`Server is running http://localhost:${PORT}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
