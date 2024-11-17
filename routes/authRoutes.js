const express = require('express');
const { register, login, } = require('../controllers/authController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Rute untuk menampilkan form login
router.get('/login', (req, res) => {
    res.render('login');
});

// Rute untuk menampilkan form signup
router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/logout', authController.logout);

module.exports = router;