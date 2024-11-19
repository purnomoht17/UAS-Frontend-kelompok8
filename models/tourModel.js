const db = require('../config/database');

// Fungsi untuk membuat tour baru
const createTour = async (name, duration, max_group_size, difficulty, ratings_average, ratings_quantity, price, summary, description, image_cover, images, start_dates) => {
  const query = `
    INSERT INTO tours (name, duration, max_group_size, difficulty, ratings_average, ratings_quantity, price, summary, description, image_cover, images, start_dates)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;
  `;
  try {
    const result = await db.query(query, [name, duration, max_group_size, difficulty, ratings_average, ratings_quantity, price, summary, description, image_cover, images, start_dates]);
    return result.rows[0];
  } catch (err) {
    throw new Error('Error creating tour');
  }
};

// Fungsi untuk mendapatkan tour berdasarkan nama
const getTourByName = async (name) => {
  const query = 'SELECT * FROM tours WHERE name = $1';
  try {
    const result = await db.query(query, [name]);
    return result.rows[0];
  } catch (err) {
    throw new Error('Error fetching tour');
  }
};

// Fungsi untuk mendapatkan semua tour
const getAllTours = async () => {
  const query = 'SELECT * FROM tours';
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    throw new Error('Error fetching tours');
  }
};

const getTourById = async (id) => {
    const query = 'SELECT * FROM tours WHERE id = $1';
    try {
      const result = await db.query(query, [id]);
      if (result.rows.length === 0) {
        return null; // Jika tidak ada tour dengan ID tersebut
      }
      return result.rows[0];
    } catch (err) {
      throw new Error('Error fetching tour by ID');
    }
  };

module.exports = { createTour, getTourByName, getAllTours, getTourById };
