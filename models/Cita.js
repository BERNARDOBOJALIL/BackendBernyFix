const CitaSchema = new mongoose.Schema({
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
  codigoTramite: {
    type: String,
    required: true,
    unique: true
  },
  fechaHora: {
    type: Date,
    required: true
  },
  documentos: [{
    tipo: String,
    archivo: String,
    fechaCarga: {
      type: Date,
      default: Date.now
    }
  }],
  estadoTramite: {
    type: String,
    enum: ['pendiente', 'en_proceso', 'completado', 'rechazado'],
    default: 'pendiente'
  },
  estadoCita: {
    type: String,
    enum: ['programada', 'completada', 'cancelada', 'no_asistio'],
    default: 'programada'
  },
  fechaSolicitud: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cita', CitaSchema);