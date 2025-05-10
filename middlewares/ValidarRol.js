function validarRol(rolPermitido) {
    return (req, res, next) => {
        const usuario = req.usuario;

        if (!usuario || usuario.rol !== rolPermitido) {
            return res.status(403).json({ mensaje: 'Acceso no autorizado' });
        }

        next();
    };
}

module.exports = validarRol;
