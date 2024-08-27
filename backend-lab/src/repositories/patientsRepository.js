const {Patient} = require('../models/patientModel');


function createPatients(patients, session) {
    return Patient.insertMany(patients, { session });
}

function deletePatient(patientId, session) {
    return Patient.findByIdAndDelete(patientId).session(session).exec();
}

function getPatientsByCondition(condition) {
    return Patient.find(condition).exec();
}

function getPatientById(patientId) {
    return Patient.findById(patientId).exec();
}

function getPatients() {
    return Patient.find({}).exec();
}

async function updatePatient(id, newPatient) {
    try {
        // Encontrar o paciente pelo ID e atualizar com os novos dados
        const updatedPatient = await Patient.findOneAndUpdate(
            { _id: id }, // Filtro para encontrar o paciente pelo ID
            { $set: newPatient }, // Atualizar os campos com os novos dados
            { new: true } // 'new: true' retorna o documento atualizado
        ).exec();

        if (!updatedPatient) {
            // Se nenhum paciente foi encontrado, retornar uma mensagem de erro
            return {
                success: false,
                error: 'Patient not found.'
            };
        }

        // Retornar um objeto indicando sucesso
        return {
            success: true,
            data: updatedPatient
        };
    } catch (error) {
        // Retornar um objeto indicando erro
        return {
            success: false,
            error: error.message
        };
    }
}




module.exports = {
    createPatients,
    deletePatient,
    getPatientsByCondition,
    getPatientById,
    getPatients,
    updatePatient
};
