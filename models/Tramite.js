const mongoose = require('mongoose');

const TramiteSchema = new mongoose.Schema({
  codigoTramite: {
    type: String,
    required: true,
    unique: true
  },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  tipoTramite_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TipoTramite',
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en_proceso', 'completado', 'rechazado'],
    default: 'pendiente'
  },
  fechaSolicitud: {
    type: Date,
    default: Date.now
  },
  documentos: [{
    tipo: String,
    archivo: String,
    fechaCarga: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Tramite', TramiteSchema);
