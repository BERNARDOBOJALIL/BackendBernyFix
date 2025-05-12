const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite');
const verificarToken = require('../middlewares/auth');
const validarRol = require('../middlewares/ValidarRol');

// 1. Crear trámite (usuario) con cita
router.post('/', verificarToken, async (req, res) => {
    try {
        const nuevoTramite = new Tramite({
            usuario_id: req.usuario.id,
            tipoTramite_id: req.body.tipoTramite_id,
            codigoTramite: 'TRM-' + Date.now(),
            documentos: [],
            fechaCita: req.body.fechaCita,
            estadoCita: 'programada'
        });

        const tramiteGuardado = await nuevoTramite.save();
        res.status(201).json(tramiteGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// 2. Subir documentos a un trámite (usuario)
router.put('/:id/documentos', verificarToken, async (req, res) => {
    try {
        const tramite = await Tramite.findById(req.params.id);
        if (!tramite) return res.status(404).json({ mensaje: 'Trámite no encontrado' });

        if (tramite.usuario_id.toString() !== req.usuario.id) {
            return res.status(403).json({ mensaje: 'No autorizado para modificar este trámite' });
        }

        tramite.documentos.push({
            tipo: req.body.tipo,
            archivo: req.body.archivo,
        });

        await tramite.save();
        res.json({ mensaje: 'Documento añadido correctamente', tramite });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// 3. Consultar todos los trámites del usuario logueado
router.get('/mios', verificarToken, async (req, res) => {
    try {
        const tramites = await Tramite.find({ usuario_id: req.usuario.id }).populate('tipoTramite_id');
        res.json(tramites);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// 4. Ver un trámite propio por ID
router.get('/:id', verificarToken, async (req, res) => {
    try {
        const tramite = await Tramite.findById(req.params.id).populate('tipoTramite_id');
        if (!tramite) return res.status(404).json({ mensaje: 'Trámite no encontrado' });

        if (tramite.usuario_id.toString() !== req.usuario.id) {
            return res.status(403).json({ mensaje: 'No tienes permiso para ver este trámite' });
        }

        res.json(tramite);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// 5. Ver todos los trámites (admin)
router.get('/', verificarToken, validarRol(['admin']), async (req, res) => {
    try {
        const tramites = await Tramite.find().populate('usuario_id tipoTramite_id');
        res.json(tramites);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// 6. Cambiar estado del trámite (admin)
router.put('/:id/estado', verificarToken, validarRol(['admin']), async (req, res) => {
    try {
        const tramite = await Tramite.findById(req.params.id);
        if (!tramite) return res.status(404).json({ mensaje: 'Trámite no encontrado' });

        tramite.estado = req.body.estado;
        await tramite.save();

        res.json({ mensaje: 'Estado actualizado', tramite });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// 7. Aprobar trámite directamente (admin)
router.put('/:id/aprobar', verificarToken, validarRol(['admin']), async (req, res) => {
    try {
        const tramite = await Tramite.findById(req.params.id);
        if (!tramite) return res.status(404).json({ mensaje: 'Trámite no encontrado' });

        tramite.estado = 'completado';
        tramite.estadoCita = 'completada';
        await tramite.save();

        res.json({ mensaje: 'Trámite aprobado', tramite });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

module.exports = router;
