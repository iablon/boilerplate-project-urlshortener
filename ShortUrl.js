const { Number } = require('mongoose');
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    shortId: {
        type: Number
    }
})

module.exports = mongoose.model('ShortUrl',urlSchema);