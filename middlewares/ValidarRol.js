function validarRol(rolesPermitidos = []) {
    return (req, res, next) => {
        const usuario = req.usuario;

        if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
            return res.status(403).json({ mensaje: 'Acceso denegado. Rol no autorizado.' });
        }

        next();
    };
}

module.exports = validarRol;
