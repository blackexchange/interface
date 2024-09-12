const DeviceManager = require('./DeviceManager');

// Inicializar o gerenciador de dispositivos com a configuração
const manager = new DeviceManager('./config/devices.json');

// Iniciar os dispositivos com base no protocolo configurado
manager.startDevices();
