const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite');
const verificarToken = require('../middlewares/auth');
const validarRol = require('../middlewares/ValidarRol');

// 1. Crear trámite con cita (usuario)
router.post('/', verificarToken, async (req, res) => {
    try {
        const { tipoTramite_id, fechaHora } = req.body;

        if (!fechaHora) {
            return res.status(400).json({ mensaje: 'La fecha y hora de la cita es obligatoria' });
        }

        const nuevoTramite = new Tramite({
            usuario_id: req.usuario.id,
            tipoTramite_id,
            codigoTramite: 'TRM-' + Date.now(),
            documentos: [],
            cita: {
                fechaHora
            }
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

// Backend: /api/tramites/mios
router.get('/mios', verificarToken, async (req, res) => {
  try {
    const tramites = await Tramite.find({ usuario_id: req.usuario.id })
      .populate('tipoTramite_id'); // Agregado aquí

    res.json(tramites);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});


// 4. Ver un trámite propio por ID
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

// 5. Ver todos los trámites (admin)
router.get('/', verificarToken, validarRol(['admin']), async (req, res) => {
    try {
        const tramites = await Tramite.find();
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

// 7. Actualizar un trámite completo (admin)
router.put('/:id', verificarToken, validarRol(['admin']), async (req, res) => {
    try {
        const tramite = await Tramite.findById(req.params.id);
        if (!tramite) return res.status(404).json({ mensaje: 'Trámite no encontrado' });

        const { tipoTramite_id, cita, documentos, estado } = req.body;

        if (tipoTramite_id) tramite.tipoTramite_id = tipoTramite_id;
        if (cita?.fechaHora) tramite.cita.fechaHora = cita.fechaHora;
        if (Array.isArray(documentos)) tramite.documentos = documentos;
        if (estado) tramite.estado = estado;

        const actualizado = await tramite.save();
        res.json({ mensaje: 'Trámite actualizado', tramite: actualizado });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// 8. Eliminar un trámite (admin)
router.delete('/:id', verificarToken, validarRol(['admin']), async (req, res) => {
    try {
        const tramite = await Tramite.findByIdAndDelete(req.params.id);
        if (!tramite) return res.status(404).json({ mensaje: 'Trámite no encontrado' });

        res.json({ mensaje: 'Trámite eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = router;

