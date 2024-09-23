const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultsController');

// Rota
// Rota para criar um novo paciente
router.get('/', resultsController.getAll);


module.exports = router;
