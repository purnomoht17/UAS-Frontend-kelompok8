const express = require('express');
const router = express.Router();

const {
    getTours,
    getTourById,
    addTour,
    updateTour,
    deleteTour,
} = require('../controllers/tourController');

// Mendapatkan semua tours (API endpoint)
router.get('/', getTours);

// Mendapatkan detail tour berdasarkan ID (API endpoint)
router.get('/:id', getTourById);

// Menambahkan tour baru (API endpoint)
router.post('/', addTour);

// Memperbarui detail tour berdasarkan ID (API endpoint)
router.put('/:id', updateTour);

// Menghapus tour berdasarkan ID (API endpoint)
router.delete('/:id', deleteTour);

module.exports = router;
