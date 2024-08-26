const express = require('express');
const router = express.Router();
const observationController = require('../controllers/observationsController');

// Rota
// Rota para criar um novo paciente
router.post('/', observationController.createObservation);

router.patch('/:id', observationController.updateObservation);

module.exports = router;
