const Observation = require('../models/observationModel');
const {Patient} = require('../models/patientModel');
const {Interface} = require('../models/interfaceModel');




async function createObservationRequest(observation, session) {

    const patient = await Patient.findById(observation.patient._id).lean();
    if (!patient) {
        throw new Error('Patient not found');
    }

    // Buscar o documento completo de Interface com base no ID
    //const interfaceData = await Interface.findById(observation.interface._id).lean();
    const interfaceData = await Interface.findOne({ _id: observationData.interface._id }).lean();
      
    if (!interfaceData) {
        throw new Error('Interface not found');
    }

    observation.patient = patient;
    observation.interface = interfaceData;


    return Observation.insertMany(observation, { session });
}


async function updateResults(id, newResult) {
    try {
        // Encontra a observação pelo ID e insere/atualiza o resultado no array results
        const updatedObservation = await Observation.findOneAndUpdate(
            { _id: id ,status: { $ne: "DONE" }}, // Filtra pelo ID e pelo nome do teste
            { $push: { "results": { $each: newResult.results } } },
            { new: true} // Retorna o documento atualizado e cria um novo se não existir
        ).exec();

        if (updatedObservation){
            const allTestsCompleted = areAllTestsCompleted(updatedObservation);

            if (allTestsCompleted) {
                const doneObservation = await Observation.findOneAndUpdate(
                    { _id: id ,status: { $ne: "DONE" }}, // Filtra pelo ID e pelo nome do teste
                    { $set: { "status":"DONE"} },
                    { new: true} // Retorna o documento atualizado e cria um novo se não existir
                ).exec();
            } else {
                console.log("Nem todos os testes têm resultados.");
            }
        }
       
        return {
            success: true,
            data: updateObservation
        };

    } catch (error) {
        console.error("Error updating/inserting observation:", error);
        return error.message;
    }
}

async function updateObservation(id, newObservation) {

    const patientId = newObservation.patient;
    try {
        // Encontrar o paciente pelo ID e atualizar com os novos dados
        const updateObservation = await Observation.findOneAndUpdate(
            { _id: id , patient:patientId}, // Filtro para encontrar o paciente pelo ID
            { $set: newObservation }, // Atualizar os campos com os novos dados
            { new: true } // 'new: true' retorna o documento atualizado
        ).exec();

        if (!updateObservation) {
            // Se nenhum paciente foi encontrado, retornar uma mensagem de erro
            return {
                success: false,
                error: 'Observation not found.'
            };
        }

        // Retornar um objeto indicando sucesso
        return {
            success: true,
            data: updateObservation
        };
    } catch (error) {
        // Retornar um objeto indicando erro
        return {
            success: false,
            error: error.message
        };
    }
}

function areAllTestsCompleted(observation) {
    const { tests, results } = observation;

    // Extrai apenas os nomes dos testes de `results`
    const completedTests = results.map(result => result.test);

    // Verifica se todos os testes estão presentes em `completedTests`
    return tests.every(test => completedTests.includes(test));
}

module.exports = {

    createObservationRequest,
    updateObservation,
    updateResults
};
