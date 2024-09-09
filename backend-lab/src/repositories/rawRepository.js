const {Raw} = require('../models/rawModel');


const title = 'Raw';

function createOne(obj, session) {
    return Raw.insertMany(obj, { session });
}

 
module.exports = {
    createOne
};
