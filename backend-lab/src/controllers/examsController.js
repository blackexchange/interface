const repository = require('../repositories/examsRepository');
const logger = require('../utils/logger');

const title = 'Exam';

async function createOne(req, res, next) {

    const data = {
        ...req.body,
        createdBy: res.locals.userId,  // Adiciona o ID do usuário que enviou a requisição
    };

    try {
        const ret = await repository.createOne(data);
        res.status(201).json(ret);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function getOne(req, res, next) {
    const { id } = req.params;
    try {
        const ret = await repository.getById(id);
        if (!ret) {
            return res.status(404).json({ message: `${title} not found` });
        }
        res.json(ret);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function getAll(req, res, next) {
    try {
        const interfaces = await repository.getAll();
        res.json(interfaces);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}



async function updateOne(req, res, next) {
    const { id } = req.params;
    try {
        const update = await repository.updateOne(id, req.body);

        if (!update.success){
            return res.status(404).json({ message: update.error });
        }

        res.status(200).json(update.data);

    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function deleteOne(req, res, next) {
    const { id } = req.params;
    try {
        const deleted = await repository.deleteOne(patientId);
        if (!deleted) {
            return res.status(404).json({ message: `${title} not found`});
        }
        res.json({ message: `${title} deleted successfully` });
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}



module.exports = {
    createOne,
    getOne,
    updateOne,
    deleteOne,
    getAll
};
