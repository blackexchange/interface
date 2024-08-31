const mongoose = require('mongoose');
const Patient = require('./patientModel');

const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({

    patient: Patient.patientSchema,

    exams:[],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Referência ao modelo User
        required: true
    },

    status:{
        type: String,
        enum: ['PENDENT', 'WAITING', 'PROCESSING', 'DONE'],
        default:'PENDENT',
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

orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = {Order, orderSchema};
