const express = require('express');
const router = express.Router();

// Middleware untuk mengecek apakah user sudah login
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.get('/welcome', isAuthenticated, (req, res) => {
    res.render('welcome', { user: req.session.user });
});

module.exports = router;
