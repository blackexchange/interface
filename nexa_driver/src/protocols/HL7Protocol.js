const net = require('net');
const Logger = require('../utils/Logger');
const { parseHL7MessageToJSON, serializeHL7MessageFromJSON } = require('../utils/HL7Helper');

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
            Logger.log('Conexão encerrada (HL7)');
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
                Logger.log('Cliente desconectado (HL7 Server)');
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


        // Serializa a mensagem JSON de volta para o formato HL7
        const hl7Message = serializeHL7MessageFromJSON(message);
       // Logger.log(`Mensagem enviada (HL7 Cliente): ${JSON.stringify(message), hl7Message}`);

        // Adiciona os delimitadores de início e fim da mensagem HL7
        const formattedMessage = String.fromCharCode(0x0B) + hl7Message + String.fromCharCode(0x1C) + '\r';
       // Logger.log(`Mensagem enviada (HL7 Cliente): ${formattedMessage}`);
        
        
        if (this.isConnected) {
            Logger.log(`Mensagem enviada (HL7 Cliente): ${formattedMessage}`);

            this.client.write(formattedMessage);
            this.messageQueue.push(formattedMessage);
        
        } else {
            Logger.log('Dispositivo não está conectado (HL7)', 'ERROR');
        }
            
    }

    // Método para receber e processar mensagens HL7 com os delimitadores SB (0x0B) e EB (0x1C)
    receiveMessage(data) {
        try {
            const messageBuffer = Buffer.from(data);

            // Verifica se a mensagem contém os delimitadores válidos
            if (messageBuffer[0] === 0x0B && messageBuffer[messageBuffer.length - 2] === 0x1C && messageBuffer[messageBuffer.length - 1] === 0x0D) {
                // Remove os delimitadores
                const trimmedBuffer = messageBuffer.subarray(1, messageBuffer.length - 2);
                let rawMessage = trimmedBuffer.toString('utf8').replace(/\n/g, '');

                // Processa a mensagem HL7 e a converte para JSON
                const parsedMessageJSON = parseHL7MessageToJSON(rawMessage);
                Logger.log(`Mensagem decodificada (HL7 JSON): ${JSON.stringify(parsedMessageJSON)}`);

                // Identifica o tipo de mensagem e chama o processador correspondente
                const messageType = parsedMessageJSON.MSH?.[0]?.field8 || ''; // Acessa o campo 9 do segmento MSH
                switch (messageType) {
                    case 'ORU^R01':
                        this.processORU_R01(parsedMessageJSON);
                        break;
                    case 'QRY^Q02':
                        this.processQueryRequest(parsedMessageJSON);
                        break;
                    default:
                        Logger.log(`Tipo de mensagem não reconhecido: ${messageType}`, 'ERROR');
                }
            } else {
                throw new Error("Mensagem recebida não contém delimitadores válidos de início e fim");
            }
        } catch (err) {
            Logger.log(`Erro ao processar mensagem HL7: ${err.message}`, 'ERROR');
        }
    }

    processORU_R01(message) {
        
        const patientName = message.PID?.[0]?.field5 || ''; // No PID segmento, campo 5 está o nome do paciente
        const testResults = message.OBX || []; // Acessa todos os segmentos OBX (resultados de observação)

        Logger.log(`Nome do Paciente: ${patientName}`);
/*

        testResults.forEach(result => {
            const testName = result.field4; // Nome do teste
            const testValue = result.field5; // Valor do teste
            const unit = result.field6.trim(); // Unidade do teste
            Logger.log(`Resultado do teste ${testName}: ${testValue} ${unit}`);
        });
       */

        const ackMessage = this.createACKResponse(message); // Pega o ID da mensagem original para incluir no ACK
        const ret = this.sendMessage(ackMessage);
        Logger.log(`retorno: ${ret}`);

    }

    createACKResponse(message) {
        const messageId = message.MSH?.[0]?.field9;
        const ackType = message.MSH?.[0]?.field8;

        let headerReturn = message.MSH;

        let ackReturn = "";

        switch (ackType) {
            case "ORU^R01":
                ackReturn = "ACK^R01"
                headerReturn.field8 = ackReturn;
                
                break;
                
            case "ORU^R01":
                ackReturn = "ACK^R01"  
                
                break;
                
            default:
                break;
        }
        const ackMessage = {
            "MSH": headerReturn,
            "MSA": [
                { "field0": "MSA", "field1": "AA", "field2": messageId , "field3": "Mensagem recebida com sucesso","field4": "" ,"field5": "" , "field6": "" ,"field7": 0 ,"field8": ""}
            ]
        };
        
        return ackMessage;
    }
    

    // Método para processar solicitações de consulta
    processQueryRequest(message) {
        Logger.log("Processando QRY^Q02...");
        const barcode = message.OBR?.[0]?.field3 || ''; // Acessa o código de barras da amostra
        Logger.log(`Código de barras da amostra: ${barcode}`);

        // Envia uma resposta QCK^Q02 (confirmação de recebimento)
        const qckResponse = this.createQCKResponse();
        this.sendMessage(qckResponse);
    }

    // Método para criar uma resposta QCK^Q02
    createQCKResponse() {
        const qckMessage = {
            "MSH": [
                { "field0": "MSH", "field1": "^~\\&", "field2": "Server", "field3": "LIS", "field4": "Analyzer", "field5": "Lab", "field6": "20230911120000", "field7": "", "field8": "QCK^Q02", "field9": "12345", "field10": "P", "field11": "2.3.1" }
            ],
            "MSA": [
                { "field0": "MSA", "field1": "AA", "field2": "12345", "field3": "Consulta recebida" }
            ]
        };
        return qckMessage;
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
