const mongoose = require('mongoose');

const AResponseSchema = new mongoose.Schema({
    status : {
        type: Boolean,
    }
});

module.exports = mongoose.model('AResponse', AResponseSchema);