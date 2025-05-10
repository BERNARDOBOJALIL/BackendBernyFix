const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const verificarToken = require('../middlewares/auth');
const validarRol = require('../middlewares/ValidarRol');

// 1. Agendar cita (usuario)
router.post('/', verificarToken, async (req, res) => {
    try {
        const { tramite_id, fechaHora } = req.body;

        const nuevaCita = new Cita({
            usuario_id: req.usuario.id,
            tramite_id,
            fechaHora,
            estado: 'programada'
        });

        const citaGuardada = await nuevaCita.save();
        res.status(201).json(citaGuardada);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// 2. Ver todas las citas (admin)
router.get('/', verificarToken, validarRol(['admin']), async (req, res) => {
    try {
        const citas = await Cita.find().populate('usuario_id tramite_id');
        res.json(citas);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// 3. Cambiar estado de la cita (admin)
router.put('/:id/estado', verificarToken, validarRol(['admin']), async (req, res) => {
    try {
        const { estado } = req.body;
        const cita = await Cita.findById(req.params.id);

        if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });

        cita.estado = estado;
        await cita.save();

        res.json({ mensaje: 'Estado actualizado correctamente', cita });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

module.exports = router;