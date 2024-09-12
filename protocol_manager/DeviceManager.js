const HL7Protocol = require('./protocols/HL7Protocol');
const ASTMProtocol = require('./protocols/ASTMProtocol');
const fs = require('fs');

class DeviceManager {
    constructor(configFile) {
        this.config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
        this.devices = this.config.devices;
    }

    startDevices() {
        this.devices.forEach((device) => {
            console.log(`Iniciando dispositivo: ${device.name} com protocolo ${device.protocol}`);
            
            switch (device.protocol) {
                case 'HL7':
                    this.startHL7Device(device);
                    break;
                case 'ASTM':
                    this.startASTMDevice(device);
                    break;
                default:
                    console.log(`Protocolo desconhecido: ${device.protocol}`);
                    break;
            }
        });
    }

    startHL7Device(device) {
        const hl7 = new HL7Protocol(device);
        if (device.mode === 'TCP') {
            hl7.startTCPConnection();  // Conecta como cliente ou servidor
        }
        hl7.setTimeout(device.timeout);
    }

    startASTMDevice(device) {
        const astm = new ASTMProtocol(device);
        if (device.mode === 'Serial') {
            astm.connectSerial();
        }
        astm.setTimeout(device.timeout);
    }
}

module.exports = DeviceManager;
