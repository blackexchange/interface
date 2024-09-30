const TCPBase = require('../TCPBase'); // Classe base de comunicação TCP
const { parseHL7MessageToJSON, serializeHL7MessageFromJSON, getCurrentTimestamp,getControl } = require('../../utils/helper');
const Logger = require('../../utils/Logger');

const STX = '\x02'; // Start of Text
const ETX = '\x03'; // End of Text
const CR = '\x0D'; // Carriage Return
const LF = '\x0A'; // Line Feed
const ENQ = '\x05'; // Enquiry
const ACK = '\x06'; // Acknowledge
const NAK = '\x15'; // Negative Acknowledge
const EOT = '\x04'; // End of Transmission
const ETB = '\x17'; // End of Transmission


class ASTMProtocol extends TCPBase {
    constructor(device) {
        super(device);

        

    }

    receiveMessage(data) {
        try {
            // Acumula os dados recebidos no buffer
            this.buffer = this.buffer ? Buffer.concat([this.buffer, data]) : data;
    
            // Verifica se estamos esperando um ACK antes de continuar o envio
            if (this.awaitingAck) {
                const message = this.buffer.toString();
                if (message.includes(ACK)) {
                    Logger.log(`ACK recebido para frame ${this.currentFrameIndex + 1}`, 'INFO');
                    this.awaitingAck = false;
                    this.currentFrameIndex++;  // Avança para o próximo frame
    
                    // Envia o próximo frame, se houver
                    this.sendNextFrame();
                } else if (message.includes(NAK)) {
                    Logger.log(`NAK recebido para frame ${this.currentFrameIndex + 1}, reenviando...`, 'ERROR');
                    // Reenvia o frame atual
                    this.sendNextFrame();
                }
    
                // Após processar o ACK/NAK, limpar o buffer para os próximos dados
                this.buffer = Buffer.alloc(0);
                return;  // Sai da função, pois não precisa processar mais nada por enquanto
            }
    
            // Se não estamos aguardando ACK, processa as mensagens ASTM normalmente
            let startIdx = this.buffer.indexOf(STX); // ASTM Start of Text (STX)
            let endIdxETX = this.buffer.indexOf(ETX, startIdx); // ASTM End of Text (ETX)
            let endIdxETB = this.buffer.indexOf(ETB, startIdx); // ASTM End of Text Block (ETB)
            let idxEOT = this.buffer.indexOf(EOT); // ASTM End of Transmission (EOT)

            let idxENQ = this.buffer.indexOf(ENQ);
    
            // Mantém uma variável para acumular a mensagem até que ela esteja completa
            this.partialMessage = this.partialMessage || Buffer.alloc(0);
    
            // Processa os frames enquanto houver dados a serem lidos no buffer
            while (startIdx !== -1 && (endIdxETX !== -1 || endIdxETB !== -1)) {
                let isLastFrame = (endIdxETX !== -1 && (endIdxETX < endIdxETB || endIdxETB === -1));
                let endIdx = isLastFrame ? endIdxETX : endIdxETB;
    
                // Extrai o frame atual, que inclui o STX até ETX/ETB e checksum (2 caracteres) + CR + LF
                const messageFrame = this.buffer.slice(startIdx, endIdx + 5); // Considerando 5 caracteres para CS, CR, e LF
    
                // Remove o frame processado do buffer
                this.buffer = this.buffer.slice(endIdx + 5);

                const frameDataWithControl = messageFrame.slice(0, endIdx + 1).toString('utf8'); 
    
                // Extrai o conteúdo do frame sem o checksum
                const frameData = messageFrame.slice(1, endIdx);  // Conteúdo entre <STX> e <ETX>/<ETB>
    
                // Extrai o checksum do frame
                const checksum = messageFrame.slice(endIdx + 1, endIdx + 3).toString('utf8'); // CS em hexadecimal
    
                // Calcula o checksum do conteúdo do frame
                const calculatedChecksum = this.calculateChecksum(frameDataWithControl);
    
                // Verifica se o checksum está correto
                if (checksum !== calculatedChecksum) {
                    Logger.log(`Erro de checksum! Esperado: ${checksum}, Calculado: ${calculatedChecksum}`, 'ERROR');
                    // Se o checksum falhar, pode enviar um NAK ou descartar o frame
                    this.socket.write(NAK);
                    return;
                }
    
                Logger.log(`Checksum validado: ${checksum}`, 'INFO');
    
                // Acumula a mensagem fragmentada no buffer parcial
                this.partialMessage = Buffer.concat([this.partialMessage, frameData]);
    
                // Se o frame termina com ETX, significa que o frame atual está completo
                if (isLastFrame) {
                    Logger.log(`Frame completo recebido. Aguardando mais frames ou EOT...`, 'INFO');
                }
    
                // Atualiza os índices para buscar o próximo frame
                startIdx = this.buffer.indexOf(STX);
                endIdxETX = this.buffer.indexOf(ETX, startIdx);
                endIdxETB = this.buffer.indexOf(ETB, startIdx);
            }
    
            // Se o <EOT> for detectado, processa a mensagem completa
            if (idxEOT !== -1) {
                Logger.log(`EOT recebido. Mensagem completa recebida. Processando...`, 'INFO');
                const completeMessage = this.partialMessage.toString(); // Converte a mensagem acumulada para string
    
                // Processa a mensagem completa
                this.processMessage(completeMessage);
    
                // Limpa o buffer parcial e o buffer geral após o EOT
                this.partialMessage = Buffer.alloc(0);
                this.buffer = Buffer.alloc(0);
            }
            if (idxENQ !== -1){
                this.socket.write(ACK);
            }
    
        } catch (err) {
            Logger.log(`Erro ao processar recebimento de mensagem ASTM: ${err.message}`, 'ERROR');
        }
    }
    
     getMessageSignature(astmMessage) {
        // Mapeia e coleta os valores de field0 para cada segmento
        const signature = Object.keys(astmMessage)
            .map(segment => astmMessage[segment][0]?.field0 || '')
            .join('');


        if (signature.includes('R')) {
            return 'RESULT';
        } else if (signature.includes('Q')) {
            return 'QUERY';
        } else {
            return signature;
        }
    
        
    }
    processMessage(messageBuffer) {
        try {
            // Remove os delimitadores STX e ETX
            const trimmedBuffer = messageBuffer.slice(1, messageBuffer.length - 1);
            const rawMessage = trimmedBuffer.toString('utf8').replace(/\n/g, '');

            // Aqui você pode usar uma função para analisar a mensagem ASTM
            const parsedMessage = parseHL7MessageToJSON(rawMessage);
            this.lastMessageReceived = parsedMessage;

            const recordType = this.getMessageSignature(parsedMessage);
    
            switch (recordType) {
                case 'RESULT': // Header
                    this.processHeader(parsedMessage);
                    break;
                case 'QUERY': // Patient
                 
                default:
                    Logger.log(`Tipo de mensagem ASTM não reconhecido: ${recordType}`, 'ERROR');
            }
        } catch (err) {
            Logger.log(`Erro ao processar a mensagem ASTM: ${err.message}`, 'ERROR');
        }
    }

    sendInitMessage(){
      //  this.messageQueue.push(ENQ);
    }

    createASTMMessage() {
        // Implementa a lógica para montar uma mensagem ASTM
        const message = `${STX}H|\\^&|||Analyzer^1.0||1234|||P|1|202409291215${ETX}`;
        const checksum = this.calculateChecksum(message);
        return `${message}${checksum}${CR}${LF}`;
    }

    sendMessage( message) {
        const maxFrameLength = 240;  // Define o tamanho máximo do frame (240-250 caracteres)
        this.pendingFrames = this.fragmentMessage(message, maxFrameLength);
        this.currentFrameIndex = 0;

        // Inicia o envio do primeiro frame
        this.sendNextFrame();
    }

   

    sendNextFrame() {
        if (this.currentFrameIndex < this.pendingFrames.length) {
            const frame = this.pendingFrames[this.currentFrameIndex];
            this.socket.write(frame);  // Envia o frame atual
            this.awaitingAck = true;  // Indica que agora estamos aguardando um ACK
            Logger.log(`Frame ${this.currentFrameIndex + 1} enviado: ${frame}`, 'INFO');
        } else {
            Logger.log('Todos os frames foram enviados com sucesso!', 'INFO');
        }
    }




    fragmentMessage(message, maxFrameLength) {
        let frames = [];
        let currentFrameNumber = 1;
        
        for (let i = 0; i < message.length; i += maxFrameLength) {
            let isLastFrame = (i + maxFrameLength) >= message.length;
            let frameData = message.slice(i, i + maxFrameLength);
            
            let frame = `${STX}${currentFrameNumber}${frameData}${isLastFrame ? ETX : ETB}`;
            
            const checksum = this.calculateChecksum(frame);
            frame += `${checksum}${CR}${LF}`;
            
            frames.push(frame);
            currentFrameNumber++;
        }

        return frames;
    }
   

    processHeader(parsedMessage) {
      //  console.log(parsedMessage)
        const message = 'H|\\^&|||Analyzer^1.0||123456789|||P|1394-97|202409291230' +
                'P|1||PATIENT123||Doe^John||19850501|M|||A||Dr.Bean||' +
                'O|1|Sample123|Order456|^^^Test1&Test2&Test3|R||202409291000' +
                'R|1|^^^Test1|7.2|mg/dL|N||F' +
                'R|2|^^^Test2|120|mg/dL|H||F' +
                'R|3|^^^Test3|45|mg/dL|L||F' +
                'L|1|N';

// Enviar a mensagem longa
    this.sendMessage(message);
       // const senderInfo = parsedMessage?.header?.sender;
       // Logger.log(`Mensagem recebida do dispositivo: ${senderInfo}`, 'INFO');
    }

    processPatient(parsedMessage) {
        console.log(parsedMessage)

    }
    
    processOrder(parsedMessage) {
        console.log(parsedMessage)

    }
    
    processResult(parsedMessage) {
        const testResults = parsedMessage?.results?.map(result => ({
            test: result.testName,
            value: result.testValue,
            unit: result.testUnit,
            flags: result.testFlags,
        })) || [];
        
        const data = {
            device: this.device,
            results: testResults,
        };
        
        this.storeResult(data); // Processa o resultado
        this.sendMessage(this.createACK()); // Envia um ACK para o dispositivo
    }
    
}


module.exports = ASTMProtocol;
