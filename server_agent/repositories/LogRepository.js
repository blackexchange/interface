const {Log} = require('../models/logModel');

const title = 'Log';

function createOne(obj, session) {
    return Log.insertMany(obj, { session });
}


 
module.exports = {
    createOne
   
};
