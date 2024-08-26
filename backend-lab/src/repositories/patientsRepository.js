const Patient = require('../models/patientModel');


function createPatients(patients, session) {
    return Patient.insertMany(patients, { session });
}

function deletePatientById(patientId, session) {
    return Patient.findByIdAndDelete(patientId).session(session).exec();
}

function getPatientsByCondition(condition) {
    return Patient.find(condition).exec();
}

function getPatientById(patientId) {
    return Patient.findById(patientId).exec();
}


async function updatePatient(id, newPatient) {

    try {
        // Encontrar o paciente pelo ID e atualizar com os novos dados, ou inserir se não encontrar
        const updatedPatient = await Patient.findOneAndUpdate(
            { _id: id }, // Filtro para encontrar o paciente pelo ID
            { $set: newPatient }, // Atualizar os campos com os novos dados
            { new: true, upsert: true } // 'new: true' retorna o documento atualizado, 'upsert: true' cria o documento se não encontrar
        ).exec();

        return updatedPatient;
    } catch (error) {
        return error.message;
    }
}


module.exports = {
    createPatients,
    deletePatientById,
    getPatientsByCondition,
    getPatientById,
    updatePatient
};
