// Importando os módulos dos protocolos
//const astmProcessor = require('../protocols/ASTM/astmProcessor');
const hl7Processor = require('../protocols/HL7/hl7Processor');

const protocolProcessors = {
   // 'ASTM': astmProcessor,
    'HL7': hl7Processor,
    // Adicione outros protocolos aqui
};

function dispatchProtocol(device, data) {
    const protocol = device.protocol;

    if (protocolProcessors[protocol]) {
        //protocolProcessors[protocol].processData(data, device);
        return protocolProcessors[protocol];
    } else {
        console.error(`Protocolo ${protocol} não é suportado para o dispositivo ${device.deviceId}`);
    }
}

module.exports = { dispatchProtocol };
