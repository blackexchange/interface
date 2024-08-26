const interfacesRepository = require('../repositories/interfacesRepository');
const logger = require('../utils/logger');

async function createInterface(req, res, next) {
    try {
        const newObservation = await interfacesRepository.createInterface(req.body);
        res.status(201).json(newObservation);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    createInterface
};
