const net = require('net');
const Logger = require('../utils/Logger');


const _ = require('lodash'); // Lodash para facilitar a manipulação de arrays e objetos

// Função para processar uma mensagem HL7 nativamente
function parseHL7Message(rawMessage) {
    // Separar a mensagem em segmentos usando o delimitador de segmento (CR - Carriage Return)
    const segments = rawMessage.split('\r').filter(segment => segment !== '');

    // Mapear os segmentos em arrays de campos, separando os campos por |
    const parsedMessage = segments.map(segment => segment.split('|'));

    return parsedMessage;
}



// Função para serializar (reconstruir) a mensagem HL7
function serializeHL7Message(parsedMessage) {
    // Recriar cada segmento unindo os campos com |
    const segments = parsedMessage.map(segment => segment.join('|'));

    // Unir os segmentos com \r (carriage return) para recriar a mensagem HL7
    return segments.join('\r') + '\r';
}


class HL7Protocol {
    constructor(device) {
        this.device = device;
        this.isConnected = false;
        this.retryCount = 0;
        this.messageQueue = [];
        this.acknowledgementQueue = [];
    }

    
    // Método para iniciar conexão como cliente ou servidor com base no papel (role)
    startTCPConnection() {
        if (this.device.role === 'server') {
            this.startTCPServer();
        } else if (this.device.role === 'client') {
            this.connectTCPClient();
        } else {
            Logger.log('Papel (role) desconhecido para o dispositivo (HL7)', 'ERROR');
        }
    }

    // Método para conectar como cliente TCP
    connectTCPClient() {
        this.client = new net.Socket();

        this.client.connect(this.device.port, this.device.host, () => {
            this.isConnected = true;
            Logger.log(`Conectado ao dispositivo HL7 em ${this.device.host}:${this.device.port}`);
        });

        this.client.on('data', (data) => {
            Logger.log(`Mensagem recebida (HL7 Cliente): ${data}`);
            this.receiveMessage(data);
        });

        this.client.on('close', () => {
            this.isConnected = false;
            Logger.log(`Conexão encerrada (HL7)`);
        });

        this.client.on('error', (err) => {
            this.connectionErrorHandler(err);
        });

        return this.client;
    }

    // Método para iniciar um servidor TCP
    startTCPServer() {
        this.server = net.createServer((socket) => {
            Logger.log(`Cliente conectado (HL7 Server) a partir de ${socket.remoteAddress}:${socket.remotePort}`);

            socket.on('data', (data) => {
                Logger.log(`Mensagem recebida (HL7 Server): ${data}`);
                this.receiveMessage(data);
            });

            socket.on('close', () => {
                Logger.log(`Cliente desconectado (HL7 Server)`);
            });

            socket.on('error', (err) => {
                this.connectionErrorHandler(err);
            });
        });

        this.server.listen(this.device.port, this.device.host, () => {
            Logger.log(`Servidor HL7 ouvindo em ${this.device.host}:${this.device.port}`);
        });

        this.server.on('error', (err) => {
            Logger.log(`Erro no servidor HL7: ${err.message}`, 'ERROR');
        });
    }

    disconnect() {
        if (this.device.role === 'client' && this.client) {
            this.client.destroy();
            this.isConnected = false;
            Logger.log('Desconectado do dispositivo HL7 (cliente)');
        } else if (this.device.role === 'server' && this.server) {
            this.server.close();
            Logger.log('Servidor HL7 encerrado');
        }
    }

    // Método para enviar uma mensagem
    sendMessage(message) {
        // Serializa a mensagem HL7
        const hl7Message = hl7.serialize(message);
    
        // Adiciona os delimitadores de início e fim da mensagem
        const formattedMessage = String.fromCharCode(0x0B) + hl7Message + String.fromCharCode(0x1C) + '\r';
    
        if (this.isConnected && this.device.role === 'client') {
            this.client.write(formattedMessage);
            Logger.log(`Mensagem enviada (HL7 Cliente): ${formattedMessage}`);
            this.messageQueue.push(formattedMessage);
        } else if (this.device.role === 'server') {
            Logger.log('Mensagem enviada (HL7 Server) ainda não implementada', 'ERROR');
        } else {
            Logger.log('Dispositivo não está conectado (HL7)', 'ERROR');
        }
    }


    // Método para receber e processar mensagens
    // Método para receber e processar mensagens HL7 com os delimitadores SB (0x0B) e EB (0x1C)
// Método para receber e processar mensagens HL7 com os delimitadores SB (0x0B) e EB (0x1C)
    receiveMessage(data) {
        // O data é um Buffer, não uma string, então lidamos com ele como buffer
        const messageBuffer = Buffer.from(data);

        // Verificar se a mensagem começa com o delimitador de início de bloco (SB) e termina com EB e CR
        if (messageBuffer[0] === 0x0B && messageBuffer[messageBuffer.length - 2] === 0x1C && messageBuffer[messageBuffer.length - 1] === 0x0D) {

            // Remove os delimitadores SB e EB/CR utilizando subarray
            const trimmedBuffer = messageBuffer.subarray(1, messageBuffer.length - 2); // Remove SB (0x0B) no início e EB (0x1C) + CR (0x0D) no final

            // Converter o buffer restante para string
            let rawMessage = trimmedBuffer.toString('utf8');

            // Substituir qualquer ocorrência de \n (nova linha) por nada
            rawMessage = rawMessage.replace(/\n/g, '');

            // Processar a mensagem HL7 usando manipulação nativa
            const parsedMessage = parseHL7Message(rawMessage);
            Logger.log(`Mensagem decodificada (HL7): ${JSON.stringify(parsedMessage)}`);

            const messageType = _.get(parsedMessage, '[0][8]', ''); // Acessar o tipo da mensagem (MSH segmento, campo 9)
            switch (messageType) {
                case "QRY^Q02":
                    this.processQueryRequest(parsedMessage);
                    break;
                case "QCK^Q02":
                    this.processQueryAcknowledgment(parsedMessage);
                    break;
                case "DSR^Q03":
                    this.processDataSourceResponse(parsedMessage);
                    break;
                case "ACK^Q03":
                    this.processAcknowledgment(parsedMessage);
                    break;
                case "ORU^R01":
                    this.processObservationResult(parsedMessage);
                    break;
                default:
                    Logger.log(`Tipo de mensagem não reconhecido: ${messageType}`, 'ERROR');
            }
        } else {
            Logger.log("Mensagem recebida não contém delimitadores válidos de início e fim", 'ERROR');
        }
    }

    processORU_R01(message) {
        const patientName = _.get(message, '[1][5]', ''); // No PID segmento, campo 6, está o nome do paciente
        const testResults = _.filter(message, (segment) => segment[0] === 'OBX'); // Filtrar os segmentos OBX (resultados de observação)
    
        Logger.log(`Nome do Paciente: ${patientName}`);
        testResults.forEach(result => {
            const testName = result[3]; // Nome do teste
            const testValue = result[5]; // Valor do teste
            const unit = result[6]; // Unidade do teste
            Logger.log(`Resultado do teste ${testName}: ${testValue} ${unit}`);
        });
    }
    
    processACK_R01(message) {
        Logger.log("Processando ACK^Q03...");
    }


    processQRY_Q02(message) {
        Logger.log("Processando QRY^Q02...");
        const barcode = message[2][8]; // Exemplo de como acessar o código de barras
        Logger.log(`Código de barras da amostra: ${barcode}`);

        // Enviar uma resposta QCK^Q02 (confirmação de recebimento)
        const qckResponse = this.createQCKResponse();
        this.sendMessage(qckResponse);
    }

    
    processQCK_Q02(message) {
        Logger.log("Processando ACK^Q03...");
    }



    // Método para processar QRY^Q02 (solicitação de consulta)
    processQueryRequest(message) {
        Logger.log("Processando QRY^Q02...");
        const barcode = message[2][8]; // Exemplo de como acessar o código de barras
        Logger.log(`Código de barras da amostra: ${barcode}`);

        // Enviar uma resposta QCK^Q02 (confirmação de recebimento)
        const qckResponse = this.createQCKResponse();
        this.sendMessage(qckResponse);
    }



    processDSR_Q03(message) {
        Logger.log("Processando QRY^Q02...");
        const barcode = message[2][8]; // Exemplo de como acessar o código de barras
        Logger.log(`Código de barras da amostra: ${barcode}`);

        // Enviar uma resposta QCK^Q02 (confirmação de recebimento)
        const qckResponse = this.createQCKResponse();
        this.sendMessage(qckResponse);
    }
    

    processACK_Q03(message) {
        Logger.log("Processando ACK^Q03...");
    }
    


    // Método para processar DSR^Q03 (resposta da fonte de dados)
    processDataSourceResponse(message) {
        Logger.log("Processando DSR^Q03...");
        const patientName = message[5][5]; // Exemplo de como acessar o nome do paciente
        Logger.log(`Nome do paciente: ${patientName}`);

        const ackResponse = this.createACKResponse();
        this.sendMessage(ackResponse);
    }







    // Método para criar uma mensagem QCK^Q02 de resposta
    createQCKResponse() {
        const qckMessage = [
            ["MSH", "^~\\&", "Server", "LIS", "Analyzer", "Lab", "20230911120000", "", "QCK^Q02", "12345", "P", "2.3.1"],
            ["MSA", "AA", "12345", "Consulta recebida"]
        ];
        return qckMessage;
    }

    // Método para criar uma mensagem ACK^Q03 de resposta
    createACKResponse() {
        const ackMessage = [
            ["MSH", "^~\\&", "Server", "LIS", "Analyzer", "Lab", "20230911120000", "", "ACK^Q03", "12345", "P", "2.3.1"],
            ["MSA", "AA", "12345", "Mensagem de dados recebida"]
        ];
        return ackMessage;
    }

    connectionErrorHandler(err) {
        Logger.log(`Erro de conexão (HL7): ${err.message}`, 'ERROR');
    }

    testConnection() {
        Logger.log('Verificando conexão com o dispositivo HL7...');
        return this.isConnected;
    }

    setTimeout(timeout) {
        if (this.device.role === 'client' && this.client) {
            this.client.setTimeout(timeout, () => {
                Logger.log('Timeout atingido na conexão HL7');
                this.disconnect();
            });
        } else if (this.device.role === 'server') {
            Logger.log('Timeout não implementado para servidor HL7', 'WARN');
        }
    }
}

module.exports = HL7Protocol;
