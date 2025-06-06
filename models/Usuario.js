const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  numeroIdentificacion: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  contacto: {
    email: String,
    telefono: String
  },
  password: {
    type: String,
    required: true // Debe estar hasheada
  },
  bloqueado: {
    type: Boolean,
    default: false
    },
   rol: {
     type: String,
     enum: ['usuario', 'admin'],
     default: 'usuario'
    },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);