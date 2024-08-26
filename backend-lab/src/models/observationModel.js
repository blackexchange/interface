const mongoose = require('mongoose');
const Patient = require('./patientModel');

const observationSchema = new mongoose.Schema({

    patient: {
        type: mongoose.ObjectId,
        ref:'Patient'
    },
    
    interface: {
        type: String,

    },

    barCode: {
        type: String
    },

    material: {
        type: String,
        required: true
    },

    tests:[{
        type: String,
        required: true
    }],

    results:[{
        test: String,
        param: String,
        value: String,
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],

    status:{
        type: String,
        enum: ['PENDENT', 'WAITING', 'PROCESSING', 'DONE'],
        required: true
    },

    urgent: {
        type: Boolean
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

observationSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Observation = mongoose.model('Observation', observationSchema);

module.exports = Observation;
