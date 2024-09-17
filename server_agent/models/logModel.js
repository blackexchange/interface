const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    

    message:String,
    device:{},
    direction:String,
    barCode:String,
    typeMessage:String,
    status:String,
    createdAt: {
        type: Date,
        default: Date.now
    }
   
   
});

logSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Log = mongoose.model('Log', logSchema);

module.exports = {Log, logSchema};
