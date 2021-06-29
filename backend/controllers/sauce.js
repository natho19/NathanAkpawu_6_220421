const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
    res.json('Je teste la création d\'une sauce');
}

exports.getAllSauces = (req, res, next) => {
    res.json('Je teste la récupération de toutes les sauces');
}