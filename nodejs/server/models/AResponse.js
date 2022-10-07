const mongoose = require('mongoose');

const AResponseSchema = new mongoose.Schema({
    status : {
        type: Boolean,
    },
    subject : {
        type: String,
    },
    resource : {
        type: String,
    },
    action : {
        type: String,
    }
});

module.exports = mongoose.model('AResponse', AResponseSchema);