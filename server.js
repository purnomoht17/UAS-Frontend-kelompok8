const express = require('express');
const cors = require('cors');
const path = require("path");
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Untuk mengizinkan pengiriman data dari form

// Set EJS sebagai view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "views/public")));
app.set('views', './views'); // Folder untuk menyimpan file EJS

app.get('/', (req, res) => {
    res.render('welcome'); // Render file welcome.ejs
});
// Route untuk login page
app.get('/login', (req, res) => {
    res.render('login'); // Render file login.ejs
});

// Route untuk signup page
app.get('/signup', (req, res) => {
    res.render('signup'); // Render file signup.ejs
});
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log(`Server is running http://localhost:${PORT}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});