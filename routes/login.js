const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
    const { numeroIdentificacion, contraseña } = req.body;

    try {
        const usuario = await Usuario.findOne({ numeroIdentificacion });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (usuario.bloqueado) {
            return res.status(403).json({ mensaje: 'Usuario bloqueado' });
        }

        const esValida = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!esValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

module.exports = router;
