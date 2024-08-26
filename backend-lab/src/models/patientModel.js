const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    dateOfBirth: {
        type: Date,
        required: false
    },
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE'],
        required: true
    },
    medicalRecordNumber: {
         type: String,
        required: false
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Referência ao modelo User
        required: true
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

patientSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = {Patient, patientSchema};
