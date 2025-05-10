const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Verifica que MONGO_URI exista
if (!process.env.MONGO_URI) {
    console.error('❌ Error: MONGO_URI no está definida en el archivo .env');
    process.exit(1); // Detiene el servidor
}

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => {
        console.error('❌ Error al conectar con MongoDB:', err);
        process.exit(1);
    });

// Rutas
const usuariosRouter = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRouter);

const loginRouter = require('./routes/login');
app.use('/api/login', loginRouter);

// Aquí puedes agregar más rutas en el futuro
// const tramitesRouter = require('./routes/tramites');
// app.use('/api/tramites', tramitesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
