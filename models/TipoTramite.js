const mongoose = require('mongoose');

const TipoTramiteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: String,
  dependencia_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dependencia',
    required: true
  },
  requisitos: [String]
});

module.exports = mongoose.model('TipoTramite', TipoTramiteSchema);
