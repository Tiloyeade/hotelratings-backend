const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Use CORS and specify allowed origins
const allowedOrigins = ['http://localhost:3000', 'https://hotelratings-c199.vercel.app'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.use(bodyParser.json());

// Connect to MongoDB with error handling
mongoose.connect('mongodb://localhost:27017/hotel-ratings', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const RatingSchema = new mongoose.Schema({
    reservation: Number,
    facilities: Number,
    customerService: Number,
    remarks: String,
});

const Rating = mongoose.model('Rating', RatingSchema);

app.post('/api/ratings', async (req, res) => {
    try {
        const { reservation, facilities, customerService, remarks } = req.body;
        console.log('Received POST request:', req.body);
        const rating = new Rating({ reservation, facilities, customerService, remarks });
        await rating.save();
        res.send(rating);
    } catch (error) {
        res.status(500).send('Error saving rating');
        console.error('Error saving rating:', error);
    }
});

app.get('/api/ratings', async (req, res) => {
    try {
        console.log('Received GET request');
        const ratings = await Rating.find();
        res.send(ratings);
    } catch (error) {
        res.status(500).send('Error fetching ratings');
        console.error('Error fetching ratings:', error);
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
