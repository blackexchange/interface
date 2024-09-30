const net = require('net');

// Cria um servidor TCP
const server = net.createServer((socket) => {
    console.log('Conexão estabelecida com o cliente');

    // Evento para lidar com os dados recebidos do cliente
    socket.on('data', (data) => {
        console.log('Dados recebidos:', data.toString());
        
        // Aqui você processa a mensagem ASTM e envia respostas como <ACK> ou <NAK>
        socket.write('\x06');  // Exemplo de envio de <ACK> (código ASCII 0x06)
    });

    // Evento para quando a conexão é encerrada
    socket.on('end', () => {
        console.log('Conexão encerrada');
    });

    // Envia uma mensagem para o cliente quando a conexão é estabelecida
    socket.write('<ENQ>');
});

// O servidor escuta na porta 3000
server.listen(3000, () => {
    console.log('Servidor TCP ouvindo na porta 3000');
});
