const mongoose = require('mongoose');

const DependenciaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  contacto: {
    telefono: String,
    email: String
  }
});

module.exports = mongoose.model('Dependencia', DependenciaSchema);
