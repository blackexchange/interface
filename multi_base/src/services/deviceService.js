// src/services/deviceService.js

const DeviceRepository = require('../database/DeviceRepository');

class DeviceService {
    static async listDevices() {
        return await DeviceRepository.getAllDevices();
    }

    static async getDevice(id) {
        return await DeviceRepository.getDeviceById(id);
    }

    static async createDevice(data) {
        return await DeviceRepository.createDevice(data);
    }

    static async updateDevice(id, data) {
        return await DeviceRepository.updateDevice(id, data);
    }

    static async deleteDevice(id) {
        return await DeviceRepository.deleteDevice(id);
    }
}

module.exports = DeviceService;
