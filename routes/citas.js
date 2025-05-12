const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const verificarToken = require('../middlewares/auth');
const validarRol = require('../middlewares/ValidarRol');

// 1. Agendar cita (usuario) + crear trámite automáticamente
router.post('/', verificarToken, async (req, res) => {
    try {
        const { tipoTramite_id, fechaHora } = req.body;

        // Crear el trámite primero
        const nuevoTramite = new Tramite({
            usuario_id: req.usuario.id,
            tipoTramite_id,
            codigoTramite: 'TRM-' + Date.now(),
            documentos: []
        });

        const tramiteGuardado = await nuevoTramite.save();

        // Luego crear la cita asociada al trámite
        const nuevaCita = new Cita({
            usuario_id: req.usuario.id,
            tipoTramite_id,
            codigoTramite: tramiteGuardado.codigoTramite,
            fechaHora,
            estadoCita: 'programada',
            estadoTramite: 'pendiente' // Opcional si ya está por defecto
        });

        const citaGuardada = await nuevaCita.save();

        res.status(201).json({
            mensaje: 'Cita y trámite creados exitosamente',
            tramite: tramiteGuardado,
            cita: citaGuardada
        });
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