// Importando os módulos dos protocolos
const astmProcessor = require('../protocols/ASTM/ASTMProtocol');
const hl7Processor = require('../protocols/HL7/HL7Protocol');

const protocolProcessors = {
    'ASTM': astmProcessor,
    'HL7': hl7Processor,
    // Adicione outros protocolos aqui
};

function dispatchProtocol(device, data) {
    const protocol = device.protocol;

    if (protocolProcessors[protocol]) {
        //protocolProcessors[protocol].processData(data, device);
        return new protocolProcessors[protocol](device);
    } else {
        console.error(`Erro conectando dispositivo ${device.deviceId}`);
    }
}

module.exports = { dispatchProtocol };
