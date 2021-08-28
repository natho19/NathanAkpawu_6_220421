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
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // Si on uploade une nouvelle image
            if (req.file) {
                // Récupère le nom du fichier dans l'URL de l'image
                const filename = sauce.imageUrl.split('/images/')[1];
                // Supprime l'image correspondante
                fs.unlink(`images/${filename}`, () => {
                    // Récupère les informations de la requête et ajoute l'URL de la nouvelle image
                    const sauceObject = { 
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                        .catch(error => res.status(400).json({ error }));
                })
            }
            // Sinon, récupère seulement les informations de la requête
            else {
                Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
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
};

// J'aime, je n'aime pas et annuler j'aime ou je n'aime pas
exports.likeDislikeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;

    Sauce.findOne({ _id: req.params.id })
        .then( sauce => {
            // MongoDB: $inc = incrémenter, $push = insérer, $pull = enlever
            switch (like) {
                // L'utilisateur veut liker la sauce
                case 1 :
                    // Si l'utilisateur n'a pas encore liké cette sauce
                    if (!sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: {likes: +1}, $push: {usersLiked: userId}, _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: "J'aime"});
                        })
                        .catch(error => res.status(400).json({ error }));
                    }
                    break;
                // L'utilisateur veut annuler son like ou dislike
                case 0 : 
                    // Si l'utilisateur se trouve dans le tableau des likes, il peut annuler son like
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: {likes: -1}, $pull: {usersLiked: userId}, _id: req.params.id })
                            .then(() => {
                                res.status(200).json({ message: "J'aime annulé"});
                            })
                            .catch(error => res.status(400).json({ error }));
                    }
                    // Sinon si l'utilisateur se trouve dans le tableau des dislikes, il peut annuler son dislike
                    else if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: {dislikes: -1}, $pull: {usersDisliked: userId}, _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: "Je n'aime pas annulé"});
                        })
                        .catch(error => res.status(400).json({ error }));
                    }     
                    break;
                // L'utilisateur veut disliker la sauce
                case -1 :
                    // Si l'utilisateur n'a pas encore disliké cette sauce
                    if (!sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: {dislikes: +1}, $push: {usersDisliked: userId}, _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: "Je n'aime pas"});
                        })
                        .catch(error => res.status(400).json({ error }));
                    }
                    break;
                default :
                    throw { error: "Impossible d'ajouter ou de modifier vos likes" };
            }       
        })  
        .catch(error => res.status(404).json({ error }));
};