const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://sandysawy:dg5HkZRdjdfvjwOL@cluster0.nyw9gms.mongodb.net/traveasy',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => console.log('Connected to database'))
    }
    catch (err) {
        console.log('Failed to connect to database', err);
    }
}

module.exports = connectDB;