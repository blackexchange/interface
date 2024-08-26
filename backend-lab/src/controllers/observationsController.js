const observationsRepository = require('../repositories/observationsRepository');
const logger = require('../utils/logger');

async function createObservation(req, res, next) {
    const observationData = {
        ...req.body,
        createdBy: res.locals.userId,  // Adiciona o ID do usuário que enviou a requisição
    };
    try {
        const newObservation = await observationsRepository.createObservationRequest(observationData);
        res.status(201).json(newObservation);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function updateObservation(req, res, next) {
    const { id } = req.params;
    try {
        const updatedObservation = await observationsRepository.updateObservation(id, req.body);

        if (!updatedObservation.success){
            return res.status(404).json({ message: updatedObservation.error });
        }

        res.status(200).json(updatedObservation.data);

    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function updateResults(req, res, next) {
    const { id } = req.params;
    try {
        const updatedObservation = await observationsRepository.updateResults(id, req.body);

        if (!updatedObservation.success){
            return res.status(404).json({ message: updatedObservation.error });
        }

        res.status(200).json(updatedObservation.data);

    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    createObservation,
    updateObservation,
    updateResults
};
