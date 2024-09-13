const net = require('net');
const HL7Protocol = require('../src/protocols/HL7Protocol');
const Logger = require('../src/utils/Logger');
const { parseHL7MessageToJSON, serializeHL7MessageFromJSON } = require('../src/utils/HL7Helper');

jest.mock('net'); // Mockar a biblioteca net para simular o servidor
jest.mock('../src/utils/Logger'); // Mockar o logger para evitar poluição de logs

describe('HL7Protocol', () => {
    let device;
    let hl7Protocol;

    beforeEach(() => {
        device = { host: 'localhost', port: 12345, role: 'server' };
        hl7Protocol = new HL7Protocol(device);
        hl7Protocol.isConnected = true;
        jest.clearAllMocks();  // Limpa mocks após cada teste
    });

    it('deve iniciar um servidor TCP e aceitar conexões de clientes', () => {
        const serverMock = {
            listen: jest.fn((port, host, callback) => {
                callback(); // Simula que o servidor começou a escutar
            }),
            on: jest.fn(), // Simula eventos como 'error'
            close: jest.fn(), // Simula fechar o servidor
        };
    
        const socketMock = {
            on: jest.fn(), // Mock para simular os eventos de socket (ex: 'data', 'close')
            write: jest.fn(), // Simula a escrita de dados
            remoteAddress: 'localhost', // Simula o endereço IP do cliente
            remotePort: 12345, // Simula a porta do cliente
            
        };
    
        net.createServer.mockImplementation((callback) => {
            // Simula a criação de um servidor
            callback(socketMock); // Simula um cliente se conectando
            return serverMock;
        });
    
        hl7Protocol.startTCPConnection(); // Iniciar o servidor HL7
    
        // Verifica se o servidor está ouvindo na porta e no host corretos
        expect(serverMock.listen).toHaveBeenCalledWith(12345, 'localhost', expect.any(Function));
        expect(net.createServer).toHaveBeenCalledTimes(1);
    
        // Simula recebimento de dados do cliente
        const mockData = Buffer.from('\x0BMSH|^~\\&|Analyzer|Lab||||ORU^R01|1|P|2.3.1|\x1C\r');
        socketMock.on.mock.calls[0][1](mockData); // Simula a chamada do 'data' com dados
    
        // Ajusta a verificação para incluir apenas a parte relevante da mensagem recebida (sem delimitadores)
        expect(Logger.log).toHaveBeenCalledWith(expect.stringContaining('MSH|^~\\&|Analyzer|Lab||||ORU^R01|1|P|2.3.1|'));
    
        // Verifica se o log para o cliente conectado foi chamado corretamente
        expect(Logger.log).toHaveBeenCalledWith(
            `Cliente conectado (HL7 Server) a partir de localhost:12345`
        );
    });

    it('deve logar um erro para mensagem com tipo não reconhecido', () => {
        // Simula a mensagem HL7 com tipo desconhecido
        const mockData = Buffer.from('\x0BMSH|^~\\&|Analyzer|Lab|||||UNKNOWN^XX|1|P|2.3.1|\x1C\r');
        
        hl7Protocol.receiveMessage(mockData);

        expect(Logger.log).toHaveBeenCalledWith(expect.stringContaining('Tipo de mensagem não reconhecido: UNKNOWN^XX'),"ERROR");
    });

    it('deve chamar processamento de resultado ORU^R01', () => {
        // Simula a mensagem HL7 com tipo desconhecido
        const mockData = Buffer.from('\x0BMSH|^~\\&|Analyzer|Lab|||||ORU^R01|1|P|2.3.1|\r\x1C\r');
        
        hl7Protocol.receiveMessage(mockData);
        expect(Logger.log).toHaveBeenCalledWith(expect.stringContaining('Nome do Paciente'));
    });

    it.only('deve chamar processamento de resultado ORU^R01 e enviar ACK', () => {
        // Simula uma mensagem HL7 do tipo ORU^R01
        const mockData = Buffer.from('\x0BMSH|^~\\&|Analyzer|Lab|||||ORU^R01|1|P|2.3.1|\rPID|1||123456||SILVONEI DA HORA\rOBX|1|NM|GLUCOSE|120|mg/dL|\x1C\r');
        
        // Simula a função sendMessage para capturar o envio do ACK
      //  const sendMessageSpy = jest.spyOn(hl7Protocol, 'sendMessage').mockImplementation(() => {});
        
        // Chama a função de recebimento de mensagem
        hl7Protocol.receiveMessage(mockData);
        
        // Verifica se o nome do paciente foi logado corretamente
        
        expect(Logger.log).toHaveBeenCalledWith(expect.stringContaining('Mensagem enviad a'));
        
        // Verifica se os resultados dos testes foram logados corretamente
       
        // Verifica se o ACK foi enviado após o processamento da mensagem
        
    
        // Verifica se o ACK contém o tipo correto e o ID da mensagem original
      //  const ackMessage = sendMessageSpy.mock.calls[0][0];
       // expect(ackMessage.MSH[0].field8).toBe('ACK^R01'); // Verifica o tipo da mensagem ACK
        //expect(ackMessage.MSA[0].field2).toBe('1'); // Verifica se o ID da mensagem original foi incluído no ACK
    });
    

    it('deve lançar erro para mensagem sem delimitadores válidos', () => {
        // Simula uma mensagem sem os delimitadores 0x0B e 0x1C
        const mockData = Buffer.from('MSH|^~\\&|Analyzer|Lab||||ORU^R01|1|P|2.3.1|');

        hl7Protocol.receiveMessage(mockData);

        expect(Logger.log).toHaveBeenCalledWith(expect.stringContaining('Mensagem recebida não contém delimitadores válidos de início e fim'), 'ERROR');
    });

    
    it('deve processar a mensagem ORU^R01 corretamente e logar o nome do paciente e os resultados dos testes', () => {
        // Simula uma mensagem HL7 do tipo ORU^R01 com um paciente e resultados de teste em JSON

        const dataRaw = 'MSH|^~\&|||||20240418124118||ORU^R01|7|P|2.3.1||||0||ASCII|||\r'+
        'PID|2||||SILVONEI DA HORA|||M||||||||||||||||||SV|||||\r'+  
        'OBR|2|SILVONEIN 5H|3721|^|N|20240418055923|20240418055748|20240418053500||1^8||||20240418055748|Soro|||||||||||||||||||||||||||||||||\r'+  
        'OBX|1|NM||Amilas 405 AA l?quida|53.431886|U/L|-|N|||F||53.431886|20240418063007|||0||\r'+  
        'OBX|2|NM||Creatinina cin?tica AA l?quida - Tca. compensada|0.962758|mg/dL|-|N|||F||0.962758|20240418063201|||0|SLP|\r'+  
        'OBX|3|NM||GOT (AST) UV AA l?quida|26.364326|U/L|-|N|||F||26.364326|20240418063448|||0||\r'+  
        'OBX|4|NM||GPT (ALT) UV AA l?quida|15.917416|U/L|-|N|||F||15.917416|20240418063454|||0||\r'+  
        'OBX|5|NM||Urea UV cin?tiCA AA l?quida|39.252194|mg/dL|-|N|||F||39.252194|20240418063254|||0||\r'+  
        'OBX|6|NM||Na|138.060280|mmol/L|-|N|||F||138.060280|20240418062352|||0||\r'+  
        'OBX|7|NM||K|3.291110|mmol/L|-|N|||F||3.291110|20240418062352|||0|SLP,v|\r';
         
        const mockData = Buffer.from(`\x0B${dataRaw}\x1C\r`);

       
        hl7Protocol.receiveMessage(mockData);

        // Verifica se o nome do paciente foi logado corretamente
        expect(Logger.log).toHaveBeenCalledWith(expect.stringContaining('Nome do Paciente: SILVONEI DA HORA'));

        // Verifica se os resultados dos testes foram logados corretamente
        expect(Logger.log).toHaveBeenCalledWith(expect.stringContaining('Resultado do teste Amilas 405 AA l?quida: 53.431886 U/L'));
    });

});
