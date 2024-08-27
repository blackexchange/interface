const express = require('express');
const router = express.Router();
const interfacesController = require('../controllers/interfacesController');

// Rota
// Rota para criar um novo paciente
router.get('/', interfacesController.getInterfaces);

router.post('/', interfacesController.createInterface);

// Rota para obter um paciente específico por ID
router.get('/:id', interfacesController.getInterfaces);

// Rota para atualizar um paciente existente
router.put('/:id', interfacesController.updateInterface);

// Rota para deletar um paciente
router.delete('/:id', interfacesController.deleteInterface);
module.exports = router;
