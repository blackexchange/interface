const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patientsController');

// Rota para obter todos os pacientes
router.get('/', patientsController.getPatients);

// Rota para obter um paciente específico por ID
router.get('/:patientId', patientsController.getPatient);

// Rota para obter um paciente específico por email
router.get('/email/:email', patientsController.getPatientByEmail);

// Rota para criar um novo paciente
router.post('/', patientsController.createPatient);


// Rota para atualizar um paciente existente
router.put('/:patientId', patientsController.updatePatient);

// Rota para deletar um paciente
router.delete('/:patientId', patientsController.deletePatient);

module.exports = router;
