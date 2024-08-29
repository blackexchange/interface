const express = require('express');
const router = express.Router();
const mainController = require('../controllers/examsController');

// Rota
// Rota para criar um novo paciente
router.get('/', mainController.getAll);

router.post('/', mainController.createOne);

// Rota para obter um paciente específico por ID
router.get('/:id', mainController.getOne);

//router.get('/byCondition/:condition', mainController.ge);

// Rota para atualizar um paciente existente
router.put('/:id', mainController.updateOne);

// Rota para deletar um paciente
router.delete('/:id', mainController.deleteOne);
module.exports = router;
