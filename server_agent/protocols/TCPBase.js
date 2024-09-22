const net = require('net');
const Logger = require('../utils/Logger');
const resultRepository = require('../repositories/ResultRepository');
const interfacRepository = require('../repositories/InterfaceRepository');
const { Interface } = require('../models/interfaceModel');


const { getCurrentTimestamp } = require('../utils/helper');

class TCPBase {
    constructor(device) {
        this.device = device;
        this.isConnected = false;
        this.socket = null;
        this.index = 0;
        this.field = device.fieldMappings;

        this.messageQueue = [];
    }

    connectionErrorHandler(err) {
        Logger.log(`Erro de conexão (HL7): ${err.message}`, 'ERROR');
        Logger.logDB(`Erro de conexão (HL7): ${err.message}`, 'ERROR');
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

    // Método para iniciar conexão como cliente ou servidor com base no papel (role)
    startTCPConnection() {

        if (this.device.role === 'server') {
            this.startTCPServer();
        } else if (this.device.role === 'client') {
            this.connectTCPClient();
        } else {
            Logger.log('Papel (role) desconhecido para o dispositivo', 'ERROR');
        }
    }

    handleDeviceConnection(socket, protocolProcessor, device){
        console.log(" manipulando")

    }

    // Método para conectar como cliente TCP
    connectTCPClient() {
        this.client = new net.Socket();

        this.client.connect(this.device.port, this.device.ip, () => {
            this.isConnected = true;
            interfacRepository.setDeviceOnline(this.device._id,true);
           

            Logger.log(`Conectado ao dispositivo em ${this.device.ip}:${this.device.port}`);
        });

        this.client.on('data', (data) => {
            Logger.log(`Mensagem recebida (TCP Cliente): ${data}`);
            this.receiveMessage(data);
        });

        this.client.on('close', () => {
            this.isConnected = false;
            interfacRepository.setDeviceOnline(this.device._id,false);

            Logger.log('Conexão encerrada (TCP Cliente)');
        });

        this.client.on('error', (err) => {
            this.isConnected = false;
            interfacRepository.setDeviceOnline(this.device._id,false);

            this.connectionErrorHandler(err);
        });

        return this.client;
    }

    // Método para iniciar um servidor TCP
    async sendNextMessage() {
        if (this.index < this.messageQueue.length) {
            const message = this.messageQueue[this.index];
    
            // Enviar a mensagem e usar o callback para enviar a próxima
            const canWrite = this.socket.write(message, (err) => {
                if (err) {
                    console.error(`Erro ao enviar mensagem: ${err.message}`);
                } else {
                    console.log(`Mensagem enviada: ${message}`);

                    Logger.logDB(message,'OUT', this.device, "", "")
                    this.index++;
                    this.sendNextMessage(); // Chama recursivamente para enviar a próxima
                }
            });
    
            // Se o buffer do socket estiver cheio, esperar o evento 'drain'
            if (!canWrite) {
                this.socket.once('drain', () => {
                    console.log('Buffer drenado. Continuando envio...');
                    this.sendNextMessage(); // Continua o envio após o buffer ser drenado
                });
            }
        } else {
            this.messageQueue = [];
            this.index = 0;
            console.log('Todas as mensagens foram enviadas.');
        }
    }
    
    startTCPServer() {
        this.server = net.createServer((socket) => {
            this.socket = socket;
           
            this.isConnected = true;
            Logger.log(`Cliente conectado a partir de ${socket.remoteAddress}:${socket.remotePort}`, this.device);

            socket.on('data', (data) => {
                Logger.logDB(data);
                this.receiveMessage(data);

                this.sendNextMessage();
              
            });
            

            socket.on('close', () => {
                this.isConnected = false;
                Logger.log('Cliente desconectado (TCP Server)');
            });
            
            socket.on('end', () => {
                this.isConnected = false;
                Logger.log('Cliente desconectado (TCP Server)');
            });

            socket.on('error', (err) => {
                this.isConnected = false;
                this.connectionErrorHandler(err);
            });
        });

        this.server.listen(this.device.port, this.device.ip, () => {
            Logger.log(`Servidor ouvindo em ${this.device.ip}:${this.device.port}`);
        });

        this.server.on('error', (err) => {
            Logger.log(`Erro no servidor: ${err.message}`, 'ERROR');
        });
    }

    // Método para desconectar
    disconnect() {
        if (this.device.role === 'client' && this.client) {
            this.client.destroy();
            this.isConnected = false;
            Logger.log('Desconectado do dispositivo (cliente)');
        } else if (this.device.role === 'server' && this.server) {
            this.server.close();
            Logger.log('Servidor encerrado');
        }
    }

    // Método genérico para enviar uma mensagem
    sendMessage(message) {
       
    }

    // Métodos que as classes herdadas podem sobrescrever
    receiveMessage(data) {
        Logger.log('Mensagem recebida: ' + data);
    }

    connectionErrorHandler(err) {
        Logger.log(`Erro de conexão: ${err.message}`, 'ERROR');
    }

    async insertResult(data){

        await resultRepository.createOne(data);

    }
}

module.exports = TCPBase;
