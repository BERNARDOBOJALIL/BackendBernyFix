const express = require('express');
const router = express.Router();
const Dependencia = require('../models/Dependencia');
const verificarToken = require('../middlewares/auth');
const validarRol = require('../middlewares/ValidarRol');

// Crear nueva dependencia (solo admin)
router.post('/', verificarToken, validarRol('admin'), async (req, res) => {
  try {
    const nueva = new Dependencia(req.body);
    const guardada = await nueva.save();
    res.status(201).json(guardada);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// Obtener todas las dependencias (usuarios y admins)
router.get('/', verificarToken, async (req, res) => {
  try {
    const dependencias = await Dependencia.find();
    res.json(dependencias);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Obtener una dependencia por ID (usuarios y admins)
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const dependencia = await Dependencia.findById(req.params.id);
    if (!dependencia) {
      return res.status(404).json({ mensaje: 'Dependencia no encontrada' });
    }
    res.json(dependencia);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Actualizar una dependencia (solo admin)
router.put('/:id', verificarToken, validarRol('admin'), async (req, res) => {
  try {
    const actualizada = await Dependencia.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!actualizada) {
      return res.status(404).json({ mensaje: 'Dependencia no encontrada' });
    }
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// Eliminar una dependencia (solo admin)
router.delete('/:id', verificarToken, validarRol('admin'), async (req, res) => {
  try {
    const eliminada = await Dependencia.findByIdAndDelete(req.params.id);
    if (!eliminada) {
      return res.status(404).json({ mensaje: 'Dependencia no encontrada' });
    }
    res.json({ mensaje: 'Dependencia eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

module.exports = router;
