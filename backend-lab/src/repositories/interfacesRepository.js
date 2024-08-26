const Interface = require('../models/interfaceModel');



function createInterface(interface, session) {
    return Interface.insertMany(interface, { session });
}

module.exports = {

    createInterface,
};
