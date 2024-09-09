
const rawRepository = require('../repositories/rawRepository');


async function createOne(req, res, next) {

    const data = req.body;
    try {
        const newRaw = await rawRepository.createOne(data);
        res.status(201).json(newRaw);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}

module.exports={
    createOne
}