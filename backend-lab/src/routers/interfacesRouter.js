const express = require('express');
const router = express.Router();
const interfacesController = require('../controllers/interfacesController');

// Rota
// Rota para criar um novo paciente
router.post('/', interfacesController.createInterface);

module.exports = router;
