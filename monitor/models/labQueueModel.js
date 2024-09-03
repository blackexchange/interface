const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({

    orders:[
        

    ],
    interface:{},


    status:{
        type: String,
        enum: ['PENDENT', 'WAITING', 'PROCESSING', 'DONE'],
        default:'PENDENT',
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});


const LabQueue = mongoose.model('LabQueue', orderSchema);

module.exports = {LabQueue, orderSchema};
