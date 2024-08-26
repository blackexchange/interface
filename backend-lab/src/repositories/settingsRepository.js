const settingsModel = require('../models/settingsModel');
const bcrypt = require('bcryptjs');
const crypto = require('../utils/crypto');

const settingsCache = {};

async function getSettingsDecrypted(id) {
    let settings = settingsCache[id];

    if (!settings) {
        settings = await getSettings(id);
        settings.secretKey = crypto.decrypt(settings.secretKey);
        settingsCache[id] = settings;
    }

    return settings;
}

function clearSettingsCache(id) {
    settingsCache[id] = null;
}

async function getSettingsByEmail(email) {
    try {
        const ret = await settingsModel.findOne({ email }).exec();
        return ret;
    } catch (e) {
        console.log("Error fetching settings by email:", e);
        throw e;
    }
}

async function getSettings(id) {
    try {
        const ret = await settingsModel.findById(id).exec();
        return ret;
    } catch (e) {
        console.log("Error fetching settings by ID:", e);
        throw e;
    }
}

async function getDefaultSettings() {
    const settings = await settingsModel.findById(process.env.DEFAULT_SETTINGS_ID || 1).exec();
    return getSettingsDecrypted(settings.id);
}

async function updateSettings(id, newSettings) {
    try {
        const currentSettings = await getSettings(id);

        if (newSettings.email && newSettings.email !== currentSettings.email)
            currentSettings.email = newSettings.email;

        if (newSettings.phone !== null && newSettings.phone !== undefined
            && newSettings.phone !== currentSettings.phone)
            currentSettings.phone = newSettings.phone;

        if (newSettings.password)
            currentSettings.password = bcrypt.hashSync(newSettings.password);

        if (newSettings.apiUrl && newSettings.apiUrl !== currentSettings.apiUrl)
            currentSettings.apiUrl = newSettings.apiUrl;

        if (newSettings.streamUrl && newSettings.streamUrl !== currentSettings.streamUrl)
            currentSettings.streamUrl = newSettings.streamUrl;

        if (newSettings.accessKey && newSettings.accessKey !== currentSettings.accessKey)
            currentSettings.accessKey = newSettings.accessKey;

        if (newSettings.pushToken !== null && newSettings.pushToken !== undefined
            && newSettings.pushToken !== currentSettings.pushToken)
            currentSettings.pushToken = newSettings.pushToken;

        if (newSettings.secretKey)
            currentSettings.secretKey = crypto.encrypt(newSettings.secretKey);

        if (newSettings.sendGridKey !== null && newSettings.sendGridKey !== undefined
            && newSettings.sendGridKey !== currentSettings.sendGridKey)
            currentSettings.sendGridKey = newSettings.sendGridKey;

        if (newSettings.twilioSid !== null && newSettings.twilioSid !== undefined
            && newSettings.twilioSid !== currentSettings.twilioSid)
            currentSettings.twilioSid = newSettings.twilioSid;

        if (newSettings.twilioToken !== null && newSettings.twilioToken !== undefined
            && newSettings.twilioToken !== currentSettings.twilioToken)
            currentSettings.twilioToken = newSettings.twilioToken;

        if (newSettings.twilioPhone !== null && newSettings.twilioPhone !== undefined
            && newSettings.twilioPhone !== currentSettings.twilioPhone)
            currentSettings.twilioPhone = newSettings.twilioPhone;

        if (newSettings.telegramBot !== null && newSettings.telegramBot !== undefined
            && newSettings.telegramBot !== currentSettings.telegramBot)
            currentSettings.telegramBot = newSettings.telegramBot;

        if (newSettings.telegramChat !== null && newSettings.telegramChat !== undefined
            && newSettings.telegramChat !== currentSettings.telegramChat)
            currentSettings.telegramChat = newSettings.telegramChat;

        await currentSettings.save();

        clearSettingsCache(id);
    } catch (e) {
        console.log("Error updating settings:", e);
        throw e;
    }
}

module.exports = {
    getSettingsByEmail,
    getSettings,
    updateSettings,
    getDefaultSettings,
    getSettingsDecrypted
};
