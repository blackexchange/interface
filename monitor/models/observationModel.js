const mongoose = require('mongoose');
const Patient = require('./patientModel');
const Interface = require('./interfaceModel');

const Schema = mongoose.Schema;

const observationSchema = new mongoose.Schema({

    patient: Patient.patientSchema,
    
    interface: Interface.interfaceSchema,

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

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Referência ao modelo User
        required: true
    },

    results:[{
        test: String,
        param: String,
        value: String,
        unit: String,
        flags: [String],
        referenceRange: String,
        text: String ,
        additionalData: Schema.Types.Mixed,
        
        results:[{
            test: String,
            param: String,
            value: String,
            unit: String,
            flags: [String],
            referenceRange: String,
            text: String ,
            additionalData: Schema.Types.Mixed,
            results:[{
                test: String,
                param: String,
                value: String,
                unit: String,
                flags: [String],
                referenceRange: String,
                text: String ,
                additionalData: Schema.Types.Mixed
    
            }]

        }],
        additionalData: Schema.Types.Mixed,
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

module.exports = {Observation, observationSchema};
