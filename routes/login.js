const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login con email y password
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ 'contacto.email': email });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (usuario.bloqueado) {
            return res.status(403).json({ mensaje: 'Usuario bloqueado' });
        }

        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        // ?? Generar token JWT
        const token = jwt.sign(
            {
                id: usuario._id,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // ? Responder con el token
        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token,
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


