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

async function getInterface(req, res, next) {
    const { id } = req.params;
    try {
        const ret = await interfacesRepository.getInterfaceById(id);
        if (!ret) {
            return res.status(404).json({ message: "Interface not found" });
        }
        res.json(ret);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function getInterfaces(req, res, next) {
    try {
        const interfaces = await interfacesRepository.getInterfaces();
        res.json(interfaces);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function getInterfacesByCondition(req, res, next) {
    try {
        const condition = req.body;
        
        if (!Array.isArray(condition) || condition.length === 0) {
            return res.status(400).json({ message: 'Pipeline de agregação está vazio ou mal formatado' });
        }
        const interfaces = await interfacesRepository.getInterfaceByCondition(condition);

        
        res.json(interfaces);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}



async function updateInterface(req, res, next) {
    const { id } = req.params;
    try {
        const update = await interfacesRepository.updateInterface(id, req.body);

        if (!update.success){
            return res.status(404).json({ message: update.error });
        }

        res.status(200).json(update.data);

    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function deleteInterface(req, res, next) {
    const { id } = req.params;
    try {
        const deleted = await interfacesRepository.deleteInterface(patientId);
        if (!deleted) {
            return res.status(404).json({ message: "Interface not found" });
        }
        res.json({ message: "Interface deleted successfully" });
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}



module.exports = {
    createInterface,
    getInterfaces,
    updateInterface,
    deleteInterface,
    getInterface,
    getInterfacesByCondition
};
