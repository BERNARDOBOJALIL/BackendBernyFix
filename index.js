const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('❌ Error al conectar con MongoDB:', err));

// Rutas
const usuariosRouter = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRouter);

// Puedes agregar más rutas aquí
// const tramitesRouter = require('./routes/tramites');
// app.use('/api/tramites', tramitesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

