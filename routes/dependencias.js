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

module.exports = router;
