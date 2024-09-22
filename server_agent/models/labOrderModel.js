const mongoose = require('mongoose');
const Patient = require('./patientModel');

const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({

    orders:[
        {
            orderId: String,
            patient: Patient.patientSchema,
            orderItens:[
                {
                    itemId: String,
                    examCode: String,
                    codBar: String,
                    material: String
                }
            ],
        },

    ],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Referência ao modelo User
        required: true
    },

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


const LabOrder = mongoose.model('LabOrder', orderSchema);

module.exports = {LabOrder, orderSchema};
