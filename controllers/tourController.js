const Tour = require('../models/tourModel');

// Fungsi untuk mendapatkan semua tour
async function getTours(req, res) {
    try {
        const tours = await Tour.getAllTours();
        res.render('tours', { tours }); // Menampilkan semua tour di 'tours.ejs'
    } catch (error) {
        console.error('Error fetching tours:', error);
        res.status(500).send('Error fetching tours');
    }
}

// Fungsi untuk mendapatkan tour berdasarkan ID
const getTourById = async (req, res) => {
    try {
        const tourId = req.params.id;
        const tour = await Tour.getTourById(tourId); // Menggunakan fungsi getTourById

        if (!tour) {
            return res.status(404).send('Tour not found');
        }

        res.render('tourDetail', { tour }); // Menampilkan detail tour di 'tourDetail.ejs'
    } catch (error) {
        console.error('Error fetching tour by ID:', error);
        res.status(500).send('Server error');
    }
};

// Fungsi untuk menambahkan tour baru
const addTour = async (req, res) => {
    const { name, duration, max_group_size, difficulty, ratings_average, ratings_quantity, price, summary, description, image_cover, images, start_dates } = req.body;

    try {
        const newTour = await Tour.createTour(
            name,
            duration,
            max_group_size,
            difficulty,
            ratings_average,
            ratings_quantity,
            price,
            summary,
            description,
            image_cover,
            images,
            start_dates
        );
        res.status(201).json({ message: 'Tour created successfully', tour: newTour });
    } catch (error) {
        console.error('Error creating tour:', error);
        res.status(500).send('Error creating tour');
    }
};

// Fungsi untuk memperbarui tour
const updateTour = async (req, res) => {
    const tourId = req.params.id;
    const { name, duration, max_group_size, difficulty, ratings_average, ratings_quantity, price, summary, description, image_cover, images, start_dates } = req.body;

    try {
        const tour = await Tour.getTourById(tourId); // Gunakan fungsi getTourById

        if (!tour) {
            return res.status(404).send('Tour not found');
        }

        const updatedTour = await Tour.updateTour(
            tourId,
            name,
            duration,
            max_group_size,
            difficulty,
            ratings_average,
            ratings_quantity,
            price,
            summary,
            description,
            image_cover,
            images,
            start_dates
        );

        res.status(200).json({ message: 'Tour updated successfully', tour: updatedTour });
    } catch (error) {
        console.error('Error updating tour:', error);
        res.status(500).send('Error updating tour');
    }
};

// Fungsi untuk menghapus tour
const deleteTour = async (req, res) => {
    const tourId = req.params.id;

    try {
        const tour = await Tour.getTourById(tourId); // Gunakan fungsi getTourById

        if (!tour) {
            return res.status(404).send('Tour not found');
        }

        await Tour.deleteTour(tourId); // Tambahkan fungsi deleteTour di model
        res.status(200).send('Tour deleted successfully');
    } catch (error) {
        console.error('Error deleting tour:', error);
        res.status(500).send('Error deleting tour');
    }
};

module.exports = {
    getTours,
    getTourById,
    addTour,
    updateTour,
    deleteTour,
};
