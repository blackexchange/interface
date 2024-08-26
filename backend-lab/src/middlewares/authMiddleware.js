const jwt = require('jsonwebtoken');
const { isBlackListed } = require('../controllers/authController');

module.exports.isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded) {
                if (!isBlackListed(token)) {
                    res.locals.token = decoded;
                    res.locals.userId = decoded.id;
                    return next();
                }
            }

        } catch (err) {
            console.log(err);
        }
    }
    res.sendStatus(401);  // Unauthorized
};

module.exports.isAdmin = (req, res, next) => {
    const tokenData = res.locals.token;  // Obter o token decodificado do middleware de autenticação

    if (tokenData && tokenData.profile === 'admin') {
        return next();  // O usuário é admin, pode prosseguir
    }

    res.sendStatus(403);  // Forbidden
};
