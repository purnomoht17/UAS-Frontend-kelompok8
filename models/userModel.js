const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Fungsi untuk membuat pengguna baru
const createUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
  try {
    const result = await db.query(query, [name, email, hashedPassword]);
    return result.rows[0];
  } catch (err) {
    throw new Error('Error creating user');
  }
};

// Fungsi untuk mendapatkan pengguna berdasarkan email
const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  try {
    const result = await db.query(query, [email]);
    return result.rows[0];
  } catch (err) {
    throw new Error('Error fetching user');
  }
};

module.exports = { createUser, getUserByEmail };
