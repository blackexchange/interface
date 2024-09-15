class LISCommunication {
    constructor(server) {
        this.server = server;
    }

    startListening() {
        // O servidor começa a escutar conexões de clientes
        this.server.on('connection', (clientSocket) => {
            this.handleClientConnection(clientSocket);
        });
    }

    handleClientConnection(clientSocket) {
        // Quando o cliente envia uma mensagem, o servidor responde
        clientSocket.on('data', (data) => {
            console.log(`Server received: ${data}`);
            const newMessage = this.processMessage(data);
            clientSocket.write(newMessage);
        });
    }

    processMessage(message) {
        // Incrementa o ID (primeiro caractere) da mensagem e retorna
        const id = parseInt(message[0]) + 1;
        const newMessage = `${id}${message.slice(1)}`;
        return `Server echoes: ${newMessage}`;
    }
}

module.exports = LISCommunication;
