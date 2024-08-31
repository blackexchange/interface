const mongoose = require('mongoose');
const { Schema } = mongoose;

// Definindo o esquema para o modelo `settings`
const settingsSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    pushToken: {
        type: String,
    },
    apiUrl: {
        type: String,
    },
    streamUrl: {
        type: String,
    },
    accessKey: {
        type: String,
    },
    secretKey: {
        type: String,
    },
    sendGridKey: {
        type: String,
    },
    twilioSid: {
        type: String,
    },
    twilioToken: {
        type: String,
    },
    twilioPhone: {
        type: String,
    },
    telegramBot: {
        type: String,
    },
    telegramChat: {
        type: String,
    },
}, {
    timestamps: true // Para criar automaticamente os campos `createdAt` e `updatedAt`
});

// Criando o modelo `settings`
const settingsModel = mongoose.model('Settings', settingsSchema);

module.exports = settingsModel;
