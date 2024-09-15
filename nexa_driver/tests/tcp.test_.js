const HL7Protocol = require('../src/protocols/HL7Protocol');
// Simulação do ambiente de teste
let device;
beforeEach(() => {
    device = { host: '192.168.0.100', port: 54321, role: 'server' };
    jest.clearAllMocks(); // Limpa mocks após cada teste
});

// Mock do servidor TCP
const serverSocketMock = {
    id: 'client_1',
    on: jest.fn(),
    listen: jest.fn(),
    write: jest.fn(), // Simula o envio de dados
    end: jest.fn(), // Simula o fechamento da conexão
    destroy: jest.fn(), // Simula a destruição imediata da conexão
    setTimeout: jest.fn(), // Simula um timeout
    remoteAddress: '192.168.1.1',
    remotePort: 12345,
    localAddress: '192.168.0.100',
    localPort: 54321,
    bytesRead: 1024,
    bytesWritten: 512,
    destroyed: false,
    close: jest.fn(),
};

// Mock do cliente TCP
const clientMock = {
    id: 'client_1',
    write: jest.fn(), // Simula o envio de dados
    end: jest.fn(), // Simula o fechamento da conexão
    destroy: jest.fn(), // Simula a destruição imediata da conexão
    setTimeout: jest.fn(),
    remoteAddress: '192.168.0.100',
    remotePort: 54321,
    localAddress: '192.168.1.1',
    localPort: 12345,
    bytesRead: 1024,
    bytesWritten: 512,
    destroyed: false,
    on: jest.fn(),
    close: jest.fn(),
};

// Testando o comportamento do servidor
describe('Servidor TCP', () => {
    test('deve começar a escutar na porta correta', () => {
        const PORT = device.port;
        const HOST = device.host;

        serverSocketMock.listen(PORT, HOST, () => {
            console.log(`Server listening on ${HOST}:${PORT}`);
        });

        // Verificar se o servidor está escutando na porta e host corretos
        expect(serverSocketMock.listen).toHaveBeenCalledWith(PORT, HOST, expect.any(Function));
    });

    test('deve lidar com erros no servidor', () => {
        const errorHandler = jest.fn(); // Função mock para lidar com o erro

        serverSocketMock.on('error', errorHandler);

        const error = new Error('Erro simulado no servidor');
        serverSocketMock.on.mock.calls[0][1](error);

        expect(errorHandler).toHaveBeenCalledWith(error);
    });

    test('deve fechar o servidor corretamente', () => {
        serverSocketMock.close();
        expect(serverSocketMock.close).toHaveBeenCalled();
    });

    test('deve lidar com a conexão de cliente', () => {
        const connectionHandler = jest.fn();

        serverSocketMock.on('connection', connectionHandler);

        const clientSocket = { id: 'client_1', write: jest.fn(), end: jest.fn() };

        serverSocketMock.on.mock.calls[0][1](clientSocket);

        expect(connectionHandler).toHaveBeenCalledWith(clientSocket);
    });
});

// Testando o comportamento do cliente
describe('Cliente TCP', () => {
    test('deve enviar e receber mensagens do servidor', () => {
        const connectionHandler = jest.fn((clientSocket) => {
            // Simulando a troca de mensagens
            clientSocket.write('Hello, Server!');
            clientSocket.on('data', (data) => {
                console.log(`Received: ${data}`);
            });
        });

        serverSocketMock.on('connection', connectionHandler);

        const clientSocket = { id: 'client_1', write: jest.fn(), on: jest.fn() };

        // Disparar a conexão do cliente
        serverSocketMock.on.mock.calls[0][1](clientSocket);

        // Verificar se o cliente envia a mensagem correta
        expect(clientSocket.write).toHaveBeenCalledWith('Hello, Server!');

        // Simular a resposta do servidor
        clientSocket.on.mock.calls[0][1]('Welcome, Client!');
        expect(clientSocket.on).toHaveBeenCalledWith('data', expect.any(Function));
    });
});

// Teste para simular a troca de mensagens entre cliente e servidor
describe('Troca de mensagens entre cliente e servidor', () => {
    test('deve enviar uma mensagem ID 1 do cliente e responder pelo servidor acrescido de 1', () => {
        const serverConnectionHandler = jest.fn((clientSocket) => {
            clientSocket.on('data', (data) => {
                console.log(`Server received: ${data}`);
                let num = parseInt(data[0]) + 1;
                let newReturn = `${num}${data.slice(1)}`; 
                clientSocket.write(`Server echoes: ${newReturn}`);
            });
        });

        serverSocketMock.on('connection', serverConnectionHandler);

        // Simulando conexão do cliente
        const clientSocket = { write: jest.fn(), on: jest.fn() };

        // Simular a conexão
        serverSocketMock.on.mock.calls[0][1](clientSocket);

        // Simular envio de dados do cliente para o servidor
        clientSocket.on.mock.calls[0][1]('1 - Hello, Server!');
        expect(clientSocket.write).toHaveBeenCalledWith('Server echoes: 2 - Hello, Server!');
    });
});


describe.only('LISCommunication', () => {
    let serverSocketMock, clientSocketMock, lisCommunication;

    beforeEach(() => {
        // Mock do servidor e cliente
        serverSocketMock = {
            listen: jest.fn((port, host, callback) => {
                callback(); // Simula que o servidor começou a escutar
            }),
            on: jest.fn(), // Simula eventos como 'error'
            close: jest.fn(), // Simula fechar o servidor
        };
        
       
        clientSocketMock = {
            write: jest.fn(),
            on: jest.fn(),
        };

        // Instância da classe LISCommunication
        lisCommunication = new HL7Protocol(device);
    });

    test.only('deve iniciar o servidor e lidar com a conexão do cliente', () => {
        //lisCommunication.
 console.log(serverSocketMock.on.mock.calls)
        // Simular o evento de conexão
        expect(serverSocketMock.on).toHaveBeenCalledWith('connection', expect.any(Function));

        // Simular uma conexão de cliente
        const connectionCallback = serverSocketMock.on.mock.calls[0][1];
        connectionCallback(clientSocketMock);

        expect(clientSocketMock.on).toHaveBeenCalledWith('data', expect.any(Function));
    });

    test('deve processar a mensagem recebida e responder com o ID incrementado', () => {
        lisCommunication.startListening();

        // Simular uma conexão de cliente
        const connectionCallback = serverSocketMock.on.mock.calls[0][1];
        connectionCallback(clientSocketMock);

        // Simular o envio de dados do cliente para o servidor
        const dataCallback = clientSocketMock.on.mock.calls[0][1];
        dataCallback('1 - Hello, Server!');

        // Verificar se o servidor respondeu corretamente com o ID incrementado
        expect(clientSocketMock.write).toHaveBeenCalledWith('Server echoes: 2 - Hello, Server!');
    });
});
