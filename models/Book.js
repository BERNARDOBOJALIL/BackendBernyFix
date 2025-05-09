const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  pages: Number,
  genres: [String],
  rating: Number
});

// Forzar el nombre de la colección como 'Book'
module.exports = mongoose.model('Book', BookSchema, 'Book');
