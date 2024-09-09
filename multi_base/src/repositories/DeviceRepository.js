// src/database/DeviceRepository.js

const SqlServerDatabase = require('./knex-sqlserver');

class DeviceRepository {
    static async getAllDevices() {
        return await SqlServerDatabase.getAll('devices');
    }

    static async getDeviceById(id) {
        return await SqlServerDatabase.getById('devices', id);
    }

    static async createDevice(data) {
        return await SqlServerDatabase.insert('devices', data);
    }

    static async updateDevice(id, data) {
        return await SqlServerDatabase.updateById('devices', id, data);
    }

    static async deleteDevice(id) {
        return await SqlServerDatabase.deleteById('devices', id);
    }
}

module.exports = DeviceRepository;
