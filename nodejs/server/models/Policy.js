const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
    subject : {
        type: String,
    },
    resource : {
        type: String,
    },
    action : {
        type: String,
    },
    effect : {
        type: String,
    }
});

module.exports = mongoose.model('Policy', PolicySchema);