const express = require('express');
const { signup, login, logout} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

// Rute untuk menampilkan form login
router.get('/login', (req, res) => {
    res.render('login');
});

// Rute untuk menampilkan form signup
router.get('/signup', (req, res) => {
    res.render('signup');
});

module.exports = router;
