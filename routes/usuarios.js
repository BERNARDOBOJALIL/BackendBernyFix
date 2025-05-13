const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const auth = require('../middlewares/auth');
const validarRol = require('../middlewares/ValidarRol');

// Funci�n para generar un n�mero �nico
async function generarNumeroIdentificacionUnico() {
    let numero;
    let existe = true;
    while (existe) {
        numero = Math.floor(100000 + Math.random() * 900000).toString(); // 6 d�gitos
        const existente = await Usuario.findOne({ numeroIdentificacion: numero });
        if (!existente) {
            existe = false;
        }
    }
    return numero;
}

// Crear usuario (registro p�blico)
router.post('/', async (req, res) => {
    try {
        const { password, ...resto } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const numeroGenerado = await generarNumeroIdentificacionUnico();

        const nuevoUsuario = new Usuario({
            ...resto,
            numeroIdentificacion: numeroGenerado,
            password: hashedPassword
        });

        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtener todos los usuarios (solo admin)
router.get('/', auth, validarRol('admin'), async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener un usuario por ID (el mismo usuario o admin)
router.get('/:id', auth, async (req, res) => {
    try {
        if (req.usuario.id !== req.params.id && req.usuario.rol !== 'admin') {
            return res.status(403).json({ message: 'Acceso no autorizado' });
        }

        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'No encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar usuario (el mismo usuario o admin)
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.usuario.id !== req.params.id && req.usuario.rol !== 'admin') {
            return res.status(403).json({ message: 'Acceso no autorizado' });
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(usuarioActualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// GET /api/usuarios/me
router.get('/me', auth, async (req, res) => {
  console.log('req.usuario:', req.usuario); // <-- esto
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el perfil del usuario' });
  }
});



// Eliminar usuario (solo admin)
router.delete('/:id', auth, validarRol('admin'), async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.params.id);
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

