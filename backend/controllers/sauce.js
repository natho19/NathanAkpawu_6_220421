const Sauce = require('../models/Sauce');

// Ajouter une nouvelle sauce
exports.createSauce = (req, res, next) => {
    res.json('Je teste la création d\'une sauce');
}

// Afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}