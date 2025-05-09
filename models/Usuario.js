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
  contraseña: {
    type: String,
    required: true // Debe estar hasheada
  },
  bloqueado: {
    type: Boolean,
    default: false
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);