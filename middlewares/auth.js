const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    try {
        const tokenSinBearer = token.startsWith('Bearer ')
            ? token.split(' ')[1]
            : token;

        const decoded = jwt.verify(tokenSinBearer, process.env.JWT_SECRET);
        req.usuario = decoded; // Guardamos la info del usuario en el request
        next();
    } catch (error) {
        return res.status(403).json({ mensaje: 'Token inválido' });
    }
}

module.exports = verificarToken;

