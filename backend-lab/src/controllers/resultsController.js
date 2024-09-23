const resultRepository = require('../repositories/resultsRepository');
const logger = require('../utils/logger');



 async function getAll(req, res, next) {
    try {
        const results =  await resultRepository.getAll();
        res.json(results);
    } catch (err) {
        logger('system', err);
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
 
    getAll
};
