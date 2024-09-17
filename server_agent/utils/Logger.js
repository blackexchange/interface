const logRepository = require('../repositories/LogRepository');


class Logger {
    static log(message, device ={}, level = 'INFO') {
        console.log(`[${level}] - ${new Date().toISOString()} - ${message}`);
    }

    
   static async logDB(message, direction, device, barCode="", type) {
/*
        const data = {
            ...req.body,
            createdBy: res.locals.userId,  // Adiciona o ID do usuário que enviou a requisição
        };
        */

        const data = {
            message,
            device,
            direction,
            barCode,
            type
           // createdBy: res.locals.userId,  // Adiciona o ID do usuário que enviou a requisição
        };

        try {
            const ret = await logRepository.createOne(data);
           // res.status(201).json(ret);
        } catch (err) {
            log('system', err);
           // res.status(500).json({ message: err.message });
        }
    }


}

module.exports = Logger;
