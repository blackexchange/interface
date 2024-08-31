const ordersRepository = require('../repositories/ordersRepository');
const logger = require('../utils/logger');
const {generateSampleNumber} = require('../utils/lab');


async function createOne(req, res, next) {

    const data = {
        ...req.body,
        createdBy: res.locals.userId,  // Adiciona o ID do usuário que enviou a requisição
    };
    
    // Gera o código de barras para cada exame com base no código do exame ou ID do paciente
    const examsData = data.exams.map(exam => {
        const composition = res.locals.userId + data.patient._id;
        const barcode = generateSampleNumber(composition); // Baseia o código de barras no ID do paciente

        return {
            ...exam,
            barCode: barcode // Adiciona o código de barras ao exame
        };
    });
    
    
    // Atualiza a lista de exames no objeto `data` com os códigos de barras gerados
    data.exams = examsData;
    

    try {
        const newOrder = await ordersRepository.createOne(data);
        res.status(201).json(newOrder);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function getOne(req, res, next) {
    const { id } = req.params;
    try {
        const ret = await ordersRepository.getById(id);
        if (!ret) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(ret);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function getAll(req, res, next) {
    try {
        const orders = await ordersRepository.getAll();
        res.json(orders);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function updateOne(req, res, next) {
    const { id } = req.params;
    try {
        const update = await ordersRepository.updateOne(id, req.body);

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
        const deleted = await ordersRepository.deleteOne(id);
        if (!deleted) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json({ message: "Order deleted successfully" });
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
