const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite');
const verificarToken = require('../middlewares/auth');

// 1. Crear trámite
router.post('/', verificarToken, async (req, res) => {
    try {
        const nuevoTramite = new Tramite({
            usuario_id: req.usuario.id,
            tipoTramite_id: req.body.tipoTramite_id,
            codigoTramite: 'TRM-' + Date.now(), // puedes hacer un generador real si quieres
            documentos: [],
        });

        const tramiteGuardado = await nuevoTramite.save();
        res.status(201).json(tramiteGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// 2. Subir documentos a un trámite (solo dueño puede)
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

// 3. Obtener todos mis trámites
router.get('/mios', verificarToken, async (req, res) => {
    try {
        const tramites = await Tramite.find({ usuario_id: req.usuario.id });
        res.json(tramites);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// 4. Ver un trámite por ID (solo si es mío)
router.get('/:id', verificarToken, async (req, res) => {
    try {
        const tramite = await Tramite.findById(req.params.id);

        if (!tramite) return res.status(404).json({ mensaje: 'Trámite no encontrado' });
        if (tramite.usuario_id.toString() !== req.usuario.id) {
            return res.status(403).json({ mensaje: 'No tienes permiso para ver este trámite' });
        }

        res.json(tramite);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = router;
