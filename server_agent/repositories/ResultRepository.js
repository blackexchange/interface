const {InterfaceResult} = require('../models/interfaceResultModel');

const title = 'InterfaceResult';

function createOne(obj, session) {
    return InterfaceResult.insertMany(obj, { session });
}


 
module.exports = {
    createOne
   
};
