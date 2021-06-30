const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Récupère le token du header en séparant "Bearer" du "token"
        const token = req.headers.authorization.split(' ')[1];
        // verify permet de décoder le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        // Si l'id existe et qu'il est différent de celui récupéré dans le token
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !'
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée' });
    }
};