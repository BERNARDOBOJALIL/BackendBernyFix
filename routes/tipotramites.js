const express = require('express');
const router = express.Router();
const TipoTramite = require('../models/TipoTramite');
const verificarToken = require('../middlewares/auth');
const validarRol = require('../middlewares/ValidarRol');

// Crear nuevo tipo de trámite (solo admin)
router.post('/', verificarToken, validarRol('admin'), async (req, res) => {
    try {
        const nuevoTipo = new TipoTramite(req.body);
        const tipoGuardado = await nuevoTipo.save();
        res.status(201).json(tipoGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// Obtener todos los tipos de trámite
router.get('/', verificarToken, async (req, res) => {
    try {
        const tipos = await TipoTramite.find().populate('dependencia_id', 'nombre');
        res.json(tipos);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Actualizar un tipo de trámite
router.put('/:id', verificarToken, validarRol('admin'), async (req, res) => {
    try {
        const actualizado = await TipoTramite.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

//Eliminar tipo de trámite
router.delete('/:id', verificarToken, validarRol('admin'), async (req, res) => {
    try {
        await TipoTramite.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Tipo de trámite eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = router;
