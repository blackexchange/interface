const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/labOrdersController');

// Rota
// Rota para criar um novo paciente
router.get('/', ordersController.getAll);

router.post('/', ordersController.createOne);

// Rota para obter um paciente específico por ID
router.get('/:id', ordersController.getOne);

// Rota para atualizar um paciente existente
router.put('/:id', ordersController.updateOne);

// Rota para deletar um paciente
router.delete('/:id', ordersController.deleteOne);
module.exports = router;
