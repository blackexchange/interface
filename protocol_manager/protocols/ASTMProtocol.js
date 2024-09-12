const { SerialPort } = require('serialport');
const Logger = require('../utils/Logger');

class ASTMProtocol {
    constructor(device) {
        this.device = device;
        this.isConnected = false;
        this.retryCount = 0;
        this.messageQueue = [];
        this.acknowledgementQueue = [];
    }

    connectSerial() {
        // Verifique se o dispositivo tem a configuração correta da porta serial
        if (!this.device.serial_port || !this.device.baud_rate) {
            Logger.log('Porta serial ou baud_rate não configurados corretamente (ASTM)', 'ERROR');
            return;
        }

        this.port = new SerialPort({
            path: this.device.serial_port,  // Certifique-se de que a propriedade `path` está sendo usada corretamente
            baudRate: this.device.baud_rate
        });

        this.port.on('open', () => {
            this.isConnected = true;
            Logger.log(`Conectado ao dispositivo ASTM na porta ${this.device.serial_port}`);
        });

        this.port.on('data', (data) => {
            Logger.log(`Mensagem recebida (ASTM): ${data}`);
            this.receiveMessage(data);
        });

        this.port.on('close', () => {
            this.isConnected = false;
            Logger.log(`Conexão serial encerrada (ASTM)`);
        });

        this.port.on('error', (err) => {
            this.connectionErrorHandler(err);
        });

        return this.port;
    }

    disconnect() {
        if (this.port && this.isConnected) {
            this.port.close();
            this.isConnected = false;
            Logger.log('Desconectado do dispositivo ASTM');
        }
    }

    sendMessage(message) {
        if (this.isConnected) {
            this.port.write(this.encodeMessage(message));
            Logger.log(`Mensagem enviada (ASTM): ${message}`);
            this.messageQueue.push(message);
        } else {
            Logger.log('Dispositivo não está conectado (ASTM)', 'ERROR');
        }
    }

    receiveMessage(data) {
        const decodedMessage = this.decodeMessage(data);
        Logger.log(`Mensagem decodificada (ASTM): ${decodedMessage}`);
    }

    encodeMessage(message) {
        return message;
    }

    decodeMessage(data) {
        return data.toString();
    }

    retrySend() {
        if (this.retryCount < 3) {
            this.retryCount++;
            const lastMessage = this.messageQueue[this.messageQueue.length - 1];
            this.sendMessage(lastMessage);
            Logger.log(`Tentativa de reenvio (ASTM), tentativa número: ${this.retryCount}`);
        } else {
            Logger.log('Falha no envio após múltiplas tentativas (ASTM)', 'ERROR');
        }
    }

    connectionErrorHandler(err) {
        Logger.log(`Erro de conexão (ASTM): ${err.message}`, 'ERROR');
    }

    testConnection() {
        Logger.log('Verificando conexão com o dispositivo ASTM...');
        return this.isConnected;
    }

    setTimeout(timeout) {
        // Implementar timeout se necessário
    }
}

module.exports = ASTMProtocol;
