const mongoose = require('mongoose');

const rawSchema = new mongoose.Schema({

    client: Object,
    messageType: String,
    data:[],
    params:[],
    dateTime: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});
rawSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Raw = mongoose.model('Raw', rawSchema);

module.exports = {Raw, rawSchema};
