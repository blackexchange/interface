const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    phone: [{
        type: String
    }],

    email: {
        type: String,
        required:true
    },

    active: {
        type:Boolean,
        default: false
    },

    contacts:[{
        "name":String,
        "email":String,
        "phone":String
    }],

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

partnerSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;
