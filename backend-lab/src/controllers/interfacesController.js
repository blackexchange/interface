const interfacesRepository = require('../repositories/interfacesRepository');
const logger = require('../utils/logger');

async function createInterface(req, res, next) {

    const data = {
        ...req.body,
        createdBy: res.locals.userId,  // Adiciona o ID do usuário que enviou a requisição
    };

    try {
        const newObservation = await interfacesRepository.createInterface(data);
        res.status(201).json(newObservation);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    createInterface
};
