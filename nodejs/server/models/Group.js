const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name : {
        type: String,
    },
    subject : {
        type: String,
    }
});

module.exports = mongoose.model('Group', GroupSchema);