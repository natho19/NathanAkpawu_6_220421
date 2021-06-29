const express = require('express');
const router = express.Router();

const sauceController = require('../controllers/sauce');
const auth = require('../middleware/auth');

router.post('/', auth, sauceController.createSauce);
router.get('/', auth, sauceController.getAllSauces);

module.exports = router