const express = require('express');
const router = express.Router();
const partnersController = require('../controllers/partnersController');

// Rota
// Rota para criar um novo paciente
router.post('/', partnersController.createPartner);

router.put('/:id', partnersController.updatePartner);

module.exports = router;
