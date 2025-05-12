const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Tramite = require('../models/Tramite');
const verificarToken = require('../middlewares/auth');
const validarRol = require('../middlewares/ValidarRol');

// 1. Crear tr�mite (usuario)
router.post('/', verificarToken, async (req, res) => {
    try {
        const nuevoTramite = new Tramite({
            usuario_id: req.usuario.id,
            tipoTramite_id: req.body.tipoTramite_id,
            codigoTramite: 'TRM-' + Date.now(),
            documentos: [],
        });

        const tramiteGuardado = await nuevoTramite.save();
        res.status(201).json(tramiteGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// 2. Subir documentos a un tr�mite (usuario)
router.put('/:id/documentos', verificarToken, async (req, res) => {
    try {
        const tramite = await Tramite.findById(req.params.id);
        if (!tramite) return res.status(404).json({ mensaje: 'Tr�mite no encontrado' });

        if (tramite.usuario_id.toString() !== req.usuario.id) {
            return res.status(403).json({ mensaje: 'No autorizado para modificar este tr�mite' });
        }

        tramite.documentos.push({
            tipo: req.body.tipo,
            archivo: req.body.archivo,
        });

        await tramite.save();
        res.json({ mensaje: 'Documento a�adido correctamente', tramite });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// 3. Consultar todos los tr�mites del usuario logueado
router.get('/mios', verificarToken, async (req, res) => {
    try {
        console.log('Usuario autenticado:', req.usuario);
        const tramites = await Tramite.find({ usuario_id: req.usuario.id }).populate('tipoTramite_id'); // Esto trae los detalles del tipo de trámite

        res.json(tramites);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// 4. Ver un tr�mite propio por ID
router.get('/:id', verificarToken, async (req, res) => {
    try {
        const tramite = await Tramite.findById(req.params.id);
        if (!tramite) return res.status(404).json({ mensaje: 'Tr�mite no encontrado' });

        if (tramite.usuario_id.toString() !== req.usuario.id) {
            return res.status(403).json({ mensaje: 'No tienes permiso para ver este tr�mite' });
        }

        res.json(tramite);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// 5. Ver todos los tr�mites (admin)
router.get('/', verificarToken, validarRol(['admin']), async (req, res) => {
    try {
        const tramites = await Tramite.find();
        res.json(tramites);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// 6. Cambiar estado del tr�mite (admin)
router.put('/:id/estado', verificarToken, validarRol(['admin']), async (req, res) => {
    try {
        const tramite = await Tramite.findById(req.params.id);
        if (!tramite) return res.status(404).json({ mensaje: 'Tr�mite no encontrado' });

        tramite.estado = req.body.estado;
        await tramite.save();

        res.json({ mensaje: 'Estado actualizado', tramite });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// 7. Aprobar tr�mite directamente (admin)
router.put('/:id/aprobar', verificarToken, validarRol(['admin']), async (req, res) => {
    try {
        const tramite = await Tramite.findById(req.params.id);
        if (!tramite) return res.status(404).json({ mensaje: 'Tr�mite no encontrado' });

        tramite.estado = 'completado';
        await tramite.save();

        res.json({ mensaje: 'Tr�mite aprobado', tramite });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

module.exports = router;
