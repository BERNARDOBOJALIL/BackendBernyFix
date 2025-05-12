const mongoose = require('mongoose');

const CitaSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  tramite_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tramite',
    required: true
  },
  fechaHora: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['programada', 'completada', 'cancelada', 'no_asistio'],
    default: 'programada'
  }
});

module.exports = mongoose.model('Cita', CitaSchema);
