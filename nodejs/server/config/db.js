    const mongoose = require('mongoose');

    const connectDB = async () => {
        const conn = await mongoose.connect(process.env.MONGO_DB_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    }

    module.exports = connectDB;