const HL7Protocol = require('./src/protocols/HL7Protocol');
const Logger = require('./src/utils/Logger');

// Configurações do dispositivo (servidor ou cliente)
const deviceConfig = {
    host: '127.0.0.1',  // Endereço IP ou nome do host do dispositivo
    port: 9600,        // Porta em que o dispositivo vai escutar ou se conectar
    role: 'server',     // Defina 'server' para iniciar como servidor ou 'client' para iniciar como cliente
};

function startHL7Service() {
    // Inicializa a instância do protocolo HL7 com a configuração do dispositivo
    const hl7Protocol = new HL7Protocol(deviceConfig);

    // Inicia a conexão (como cliente ou servidor, com base na configuração do dispositivo)
    hl7Protocol.startTCPConnection();

    // Verifica a conexão
    if (hl7Protocol.testConnection()) {
        Logger.log('Serviço HL7 iniciado com sucesso.');
    } else {
        Logger.log('Falha ao iniciar o serviço HL7.', 'ERROR');
    }

    // Opcional: define um timeout para a conexão
    hl7Protocol.setTimeout(30000); // Define um timeout de 30 segundos
}

// Inicia o serviço HL7
startHL7Service();
