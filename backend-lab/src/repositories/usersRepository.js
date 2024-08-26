const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const crypto = require('../utils/crypto');

const objCache = {};

async function getDecrypted(id) {
    let obj = objCache[id];

    if (!obj) {
        obj = await getObj(id);
        obj.secretKey = crypto.decrypt(obj.secretKey);
        objCache[id] = obj;
    }

    return obj;
}

function clearCache(id) {
    objCache[id] = null;
}

async function getUserByEmail(email) {
    try {
        const ret = await User.findOne({ email }).exec();
        return ret;
    } catch (e) {
        console.log("Error fetching settings by email:", e);
        throw e;
    }
}

function createUser(obj, session) {

    obj.password = bcrypt.hashSync(obj.password);
    obj.profile='user';

    return User.insertMany(obj, { session });
}

function deleteUser(id, session) {
    return User.findByIdAndDelete(id).session(session).exec();
}

async function getUser(id) {
    try {
        const ret = await User.findById(id).exec();
        return ret;
    } catch (e) {
        console.log("Error fetching settings by ID:", e);
        throw e;
    }
}


async function updateUser(id, newObj) {
    try {
        const current = await getObj(id);

        if (newObj.email && newObj.email !== current.email)
            current.email = newObj.email;

        if (newObj.password)
            current.password = bcrypt.hashSync(newObj.password);
       
        await current.save();

        clearCache(id);
    } catch (e) {
        console.log("Error updating settings:", e);
        throw e;
    }
}

module.exports = {
    getUserByEmail,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    getDecrypted
};
