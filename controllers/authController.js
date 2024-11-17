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
            console.log('User  not found');
            return res.status(404).json({ error: 'User  not found' });
        }

        console.log('User  found:', user); // Log user details (hindari menampilkan password)

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid); // Log hasil validasi password

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error); // Log error
        res.status(500).json({ error: 'Error logging in' });
    }
};