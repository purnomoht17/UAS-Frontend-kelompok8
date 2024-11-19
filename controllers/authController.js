const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Fungsi untuk signup
const signup = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Cek jika user dengan email yang sama sudah ada
      const existingUser = await userModel.getUserByEmail(email);
      if (existingUser) {
        console.error(`Signup failed: User with email ${email} already exists.`);
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Simpan user baru ke database
      const newUser = await userModel.createUser(name, email, password); // Kirim password mentah
  
      // Kirim response sukses
      res.status(201).json({
        message: 'User created successfully',
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      });
    } catch (err) {
      console.error('Error creating user:', err); // Log error lebih lengkap
      res.status(500).json({ message: 'Error creating user', error: err.message });
    }
  };
  

// Fungsi untuk login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cek jika user ada di database
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      console.error(`Login failed: User with email ${email} not found.`);
      return res.status(400).json({ message: 'User not found' });
    }

    // Bandingkan password yang dimasukkan dengan yang ada di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error(`Login failed: Invalid credentials for user with email ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token untuk user
    const token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET, { expiresIn: '1h' });

    // Simpan data user di session
    req.session.user = { id: user.id, name: user.name, email: user.email };

    // Kirim response sukses dengan token
    res.redirect('/'); // Redirect ke halaman welcome
  } catch (err) {
    console.error('Error logging in:', err); // Log error lebih lengkap
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// Fungsi untuk logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err); // Log error logout
      return res.status(500).json({ error: 'Error logging out', details: err.message });
    }

    // Redirect ke login setelah logout berhasil
    res.redirect('/login?logout=success');
  });
};

module.exports = { signup, login, logout };
