const patientsRepository = require('../repositories/patientsRepository');
const logger = require('../utils/logger');

async function getPatient(req, res, next) {
    const { patientId } = req.params;
    try {
        const patient = await patientsRepository.getPatientById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json(patient);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function getPatients(req, res, next) {
    try {
        const patients = await patientsRepository.getPatients();
        res.json(patients);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function createPatient(req, res, next) {
    try {
        const data = {
            ...req.body,
            createdBy: res.locals.userId,  // Adiciona o ID do usuário que enviou a requisição
        };
    
        const newPatient = await patientsRepository.createPatients(data);
        res.status(201).json(newPatient);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}



async function updatePatient(req, res, next) {
    const { patientId } = req.params;
    try {
        const updatedPatient = await patientsRepository.updatePatient(patientId, req.body);

        if (!updatedPatient.success){
            return res.status(404).json({ message: updatedPatient.error });
        }

        res.status(200).json(updatedPatient.data);

    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function deletePatient(req, res, next) {
    const { patientId } = req.params;
    try {
        const deletedPatient = await patientsRepository.deletePatient(patientId);
        if (!deletedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json({ message: "Patient deleted successfully" });
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function getPatientByEmail(req, res, next) {
    const { email } = req.params;
    try {
        const patient = await patientsRepository.getPatientByEmail(email);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json(patient);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    getPatient,
    getPatients,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientByEmail
};
