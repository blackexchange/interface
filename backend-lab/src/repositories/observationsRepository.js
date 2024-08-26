const Observation = require('../models/observationModel');



function createObservationRequest(observation, session) {
    return Observation.insertMany(observation, { session });
}


async function updateResult(id, newResult) {

    try {
        // Encontra a observação pelo ID e insere/atualiza o resultado no array results
        const updatedObservation = await Observation.findOneAndUpdate(
            { _id: id, "results.test": newResult.test }, // Filtra pelo ID e pelo nome do teste
            { $set: { "results.$": newResult } }, // Atualiza o documento que corresponde
            { new: true, upsert: true } // Retorna o documento atualizado e cria um novo se não existir
        ).exec();

        // Se o teste não foi encontrado no array, adicionar como um novo
        if (!updatedObservation) {
            await Observation.findByIdAndUpdate(
                id,
                { $push: { results: newResult } },
                { new: true }
            ).exec();
        }

        return res.json(updatedObservation);
    } catch (error) {
        console.error("Error updating/inserting observation:", error);
        return res.status(500).send(error.message);
    }
}

async function updateObservation(id, newResult) {
console.log(newResult);
    try {
        // Encontra a observação pelo ID e insere/atualiza o resultado no array results
        const updatedObservation = await Observation.findOneAndUpdate(
            { _id: id, "results.test": newResult.test }, // Filtra pelo ID e pelo nome do teste
            { $set: { "results.$": newResult } }, // Atualiza o documento que corresponde
            { new: true, upsert: true } // Retorna o documento atualizado e cria um novo se não existir
        ).exec();

        // Se o teste não foi encontrado no array, adicionar como um novo
        if (!updatedObservation) {
            await Observation.findByIdAndUpdate(
                id,
                { $push: { results: newResult } },
                { new: true }
            ).exec();
        }

        return updatedObservation;
    } catch (error) {
        console.error("Error updating/inserting observation:", error);
      //  return res.status(500).send(error.message);
    }
}

module.exports = {

    createObservationRequest,
    updateObservation,
    updateResult
};
