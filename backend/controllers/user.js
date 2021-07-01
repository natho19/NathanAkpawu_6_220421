const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const maskdata = require('maskdata');

dotenv.config();

const User = require('../models/User');

exports.signup = (req, res, next) => {
    // Crype le mot de passe en faisant 10 tours
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                // Masque le mot de passe
                email: maskdata.maskEmail2(req.body.email),
                password: hash
            });
            // Créé un nouvel utilisateur avec le hash du mot de passe
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    // Recherche l'utilisateur dont l'email correspond à l'email de la requête
    User.findOne({ email: maskdata.maskEmail2(req.body.email) })
        .then(user => {
            // Si on ne trouve aucun utilisateur
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' })
            }
            // Bcrypt compare le mot de passe avec le hash enregistré
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si les résultats sont différents
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        // Génère un token grâce au package jsonwebtoken
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};