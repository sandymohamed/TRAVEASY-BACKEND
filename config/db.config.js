const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(  process.env.DB_URL || 'mongodb+srv://sandysawy:GJMs0Brs133ZJMkM@cluster0.nyw9gms.mongodb.net/traveasy',
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