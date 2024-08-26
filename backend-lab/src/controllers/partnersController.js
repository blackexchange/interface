const partnersRepository = require('../repositories/partnersRepository');
const logger = require('../utils/logger');

async function createPartner(req, res, next) {
    try {
        const newPartner = await partnersRepository.createPartner(req.body);
        res.status(201).json(newPartner);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

async function updatePartner(req, res, next) {
    const { id } = req.params;
    try {
        const updatedPartner = await partnersRepository.updatePartner(id, req.body);

        if (!updatedPartner.success){
            return res.status(404).json({ message: updatedPartner.error });
        }

        res.status(200).json(updatedPartner.data);

    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}




module.exports = {
    createPartner,
    updatePartner
};
