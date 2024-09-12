class HL7Protocol {
    constructor() {
        this.protocolName = 'HL7';
    }

    connectTCP(host, port) {
        const net = require('net');
        const client = new net.Socket();

        client.connect(port, host, () => {
            console.log(`[HL7] Conectado ao dispositivo HL7 em ${host}:${port}`);
        });

        client.on('data', (data) => {
            console.log(`[HL7] Mensagem recebida: ${data}`);
            // Decodificar mensagem HL7 aqui
        });

        client.on('close', () => {
            console.log(`[HL7] Conexão fechada`);
        });

        client.on('error', (err) => {
            console.log(`[HL7] Erro: ${err.message}`);
        });

        return client;
    }
}
module.exports = HL7Protocol;
