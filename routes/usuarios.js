const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs'); 

// Función para generar un número único
async function generarNumeroIdentificacionUnico() {
  let numero;
  let existe = true;
  while (existe) {
    numero = Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
    const existente = await Usuario.findOne({ numeroIdentificacion: numero });
    if (!existente) {
      existe = false;
    }
  }
  return numero;
}

// Crear usuario
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

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'No encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
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

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

