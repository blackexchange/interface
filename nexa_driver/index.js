const HL7Protocol = require('./src/protocols/HL7Protocol');
const Logger = require('./src/utils/Logger');

// Configurações dos dispositivos
const deviceConfigs = [
    { host: '127.0.0.1', port: 9600, role: 'server' },
    { host: '127.0.0.1', port: 9601, role: 'server' },
    { host: '127.0.0.1', port: 9602, role: 'client' },
    // Adicione mais dispositivos conforme necessário
];

function startHL7Services() {
    // Itera sobre cada dispositivo e cria uma instância independente do protocolo HL7
    deviceConfigs.forEach((deviceConfig, index) => {
        const hl7Protocol = new HL7Protocol(deviceConfig);

        // Inicia a conexão para o dispositivo específico
        hl7Protocol.startTCPConnection();

        // Verifica a conexão
        if (hl7Protocol.testConnection()) {
            Logger.log(`Serviço HL7 iniciado para dispositivo ${index + 1} com sucesso.`);
        } else {
            Logger.log(`Falha ao iniciar o serviço HL7 para dispositivo ${index + 1}.`, 'ERROR');
        }

        // Opcional: define um timeout para a conexão
        hl7Protocol.setTimeout(30000); // Timeout de 30 segundos
    });
}

// Inicia os serviços HL7 para todos os dispositivos
startHL7Services();
