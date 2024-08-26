const observationsRepository = require('../repositories/observationsRepository');
const logger = require('../utils/logger');

async function createObservation(req, res, next) {
    try {
        const newObservation = await observationsRepository.createObservationRequest(req.body);
        res.status(201).json(newObservation);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function updateObservation(req, res, next) {
    const id =  req.params.id;
    const newObservation = req.body;

    await observationsRepository.updateObservation(id, newObservation);
    res.sendStatus(200);
}


module.exports = {
    createObservation,
    updateObservation
};
