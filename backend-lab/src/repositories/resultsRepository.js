const {InterfaceResult} = require('../models/interfaceResultsModel');


function getAll() {
    return InterfaceResult.find({}).sort({ createdAt: -1 }).exec();
}
module.exports = {

    getAll
};
