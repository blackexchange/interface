const mongoose = require('mongoose');

const interfaceResultSchema = new mongoose.Schema({

    patient:{
        name: String,
        sex: String,
        dateOfBirth: String
    },
    barCode: String,
    sample: String,
    results: [],

    device: {},

    createdAt: {
        type: Date,
        default: Date.now
    },
    


    updatedAt: {
        type: Date,
        default: Date.now
    }
});
interfaceResultSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const InterfaceResult = mongoose.model('InterfaceResult', interfaceResultSchema);

module.exports = {InterfaceResult, interfaceResultSchema};
