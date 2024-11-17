const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        console.log('User  registered:', user); // Log user yang baru terdaftar
        res.status(201).json({ message: 'User  registered successfully', user });
    } catch (error) {
        console.error('Error registering user:', error); // Log error
        res.status(500).json({ error: 'Error registering user' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('User found:', user);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // Simpan token di session
        req.session.user = { id: user.id, name: user.name }; // Atur session dengan nama pengguna

        res.redirect('/'); // Redirect ke halaman welcome
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.redirect('/login?logout=success'); // Redirect ke login setelah logout
    });
};

