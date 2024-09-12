class ASTMProtocol {
    constructor() {
        this.protocolName = 'ASTM';
    }

    connectSerial(serialPort, baudRate) {
        const SerialPort = require('serialport');
        const port = new SerialPort(serialPort, { baudRate: baudRate });

        port.on('open', () => {
            console.log(`[ASTM] Porta serial aberta em ${serialPort} com baud rate ${baudRate}`);
        });

        port.on('data', (data) => {
            console.log(`[ASTM] Dados recebidos: ${data}`);
            // Decodificar mensagem ASTM aqui
        });

        port.on('error', (err) => {
            console.log(`[ASTM] Erro: ${err.message}`);
        });

        port.on('close', () => {
            console.log(`[ASTM] Conexão serial fechada`);
        });

        return port;
    }
}
module.exports = ASTMProtocol;
