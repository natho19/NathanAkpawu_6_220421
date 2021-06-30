const fs = require('fs');

const Sauce = require('../models/Sauce');

// Ajouter une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // Supprime l'id envoyé par la requête car mongoose génère automatiquement l'id
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        // Génère l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // Enregistre la sauce
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
}

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
    // Si on uploade une nouvelle image
        // On récupère les informations de la requête et on ajoute l'URL de la nouvelle image
    // Sinon on récupère seulement les informations de la requête
    const sauceObject = req.file ?
        { 
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    // Modifie la sauce
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // Récupère le nom du fichier dans l'URL de l'image
            const filename = sauce.imageUrl.split('/images/')[1];
            // Supprime l'image correspondante dans "images" et la sauce
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

// Afficher une sauce
exports.getOneSauce = (req, res, next) => {
    // Compare l'id dans la BD avec l'id de la requête
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        // Renvoie un tableau contenant toutes les sauces de la BD
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}