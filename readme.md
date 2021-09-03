# Sopekocko
Projet 6 du parcours développeur web d'OpenClassrooms : Construisez une API sécurisée pour une application
d'avis gastronomiques

## :dart: Objectifs attendus
- L'API doit utiliser des pratiques de **code sécurisées**
- Les données personnelles des utilisateurs doivent impérativement être **protégées**, que ce soit côté API ou côté base de données grâce à des **méthodes de masquage**
- **L'authentification** doit être **renforcée** sur les routes requises
- L'API doit respecter le **RGPD** et les standards **OWASP**
- **2 types de droits administrateur** à la base de données doivent être définis : un accès
pour supprimer ou modifier des tables, et un accès pour éditer le contenu de la base de données
- La base de données utilisée devra être **MongoDB**
- Toutes les erreurs de la base de données doivent être signalées grâce à **Mongoose**
- L'API doit **parfaitement fonctionner** avec le frontend
- Les adresses emails de la base de données doivent être **uniques**
- Toutes les routes relatives à la sauce doivent exiger une demande authentifiée par **token**

## :white_check_mark: Compétences évaluées
- Implémenter un modèle logique de données conformément à la réglementation
- Mettre en œuvre des opérations CRUD de manière sécurisée
- Stocker des données de manière sécurisée

## :rocket: Installation backend
Installer `nodejs` et `npm` sur votre machine en local. Après, se positionner sur le dossier backend à partir du projet.
```
> cd backend
```
Ensuite, installer les composants du projet.
```
> npm install
```
Enfin, lancer le projet avec `nodemon serve`
```
> nodemon serve
```
Le serveur sera accessible sur http://localhost:3000 par défaut.

## :rocket: Installation frontend
Le projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 7.0.2.
Pour le faire fonctionner, installer `node-sass` à part.
Après, se positionner sur le dossier frontend à partir du projet.
```
> cd frontend
```
Ensuite, installer les composants du projet.
```
> npm install
```
Enfin, démarrer `ng serve` pour avoir accès au serveur de développement. Rendez-vous sur `http://localhost:4200/`.
```
> ng serve
```