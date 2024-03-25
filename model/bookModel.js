const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    borrowRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const BookModel = mongoose.model('Book', bookSchema);

module.exports = { BookModel };
