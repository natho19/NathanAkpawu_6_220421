const express = require('express');
const router = express.Router();

const sauceController = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceController.createSauce);
router.get('/', auth, sauceController.getAllSauces);

module.exports = router