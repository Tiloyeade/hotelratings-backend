const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Use CORS and specify allowed origins
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hotel-ratings', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const RatingSchema = new mongoose.Schema({
    reservation: Number,
    facilities: Number,
    customerService: Number,
    remarks: String,
});

const Rating = mongoose.model('Rating', RatingSchema);

app.post('/api/ratings', async (req, res) => {
    const { reservation, facilities, customerService, remarks } = req.body;
    const rating = new Rating({ reservation, facilities, customerService, remarks });
    await rating.save();
    res.send(rating);
});

app.get('/api/ratings', async (req, res) => {
    const ratings = await Rating.find();
    res.send(ratings);
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
