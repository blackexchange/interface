const net = require('net');
const STX = '\x02'; // Start of Text
const ETX = '\x03'; // End of Text
const CR = '\x0D'; // Carriage Return
const LF = '\x0A'; // Line Feed
const ENQ = '\x05'; // Enquiry
const ACK = '\x06'; // Acknowledge
const NAK = '\x15'; // Negative Acknowledge
const EOT = '\x04'; // End of Transmission
const ETB = '\x17'; // End of Transmission
    

const client = net.createConnection({ port: 5500 }, () => {
    console.log('Conectado ao servidor LIS');
    console.log('Enviando ENQ');
    client.write('\x05'); // Envia ENQ
});

client.on('data', (data) => {
    handleControlMessages(client, data);

    const result = 'H|\\^&|||Analyzer^1.0||123456789|||P|1394-97|202409291230\r' +
        'P|1||PATIENT123||Doe^John||19850501|M|||A||Dr.Bean||\r' +
        'O|1|Sample123|Order456|^^^Test1&Test2&Test3|R||202409291000\r' +
        'R|1|^^^Test1|7.2|mg/dL|N||F\r' +
        'R|2|^^^Test2|120|mg/dL|H||F\r' +
        'R|3|^^^Test3|45|mg/dL|L||F\r' +
        'L|1|N\r';

    sendMessage(client, result);
});

client.on('end', () => {
    console.log('Desconectado do servidor LIS');
});

function handleControlMessages(socket, data) {
    const message = data.toString();
    console.log('>*********')

    // Lida com os diferentes sinais de controle
    if (message.includes('\x05')) { // ENQ
        console.log('Recebido ENQ');
        socket.write('\x06'); // Responde com ACK
    } else if (message.includes('\x04')) { // EOT
        console.log('Recebido EOT');
        socket.end(); // Finaliza a conexão
    } else if (message.includes('\x15')) { // NAK
        console.log('Recebido NAK');
        // Reenvia a mensagem ou trata o erro
    } else if (message.includes('\x06')) { // ACK
        console.log('Recebido ACK');
        // Pronto para enviar próxima mensagem
    }
    else if (message.includes('\x03')) { // ACK
        console.log('Recebido ETX');
        socket.write('\x06'); // Responde com ACK

        // Pronto para enviar próxima mensagem
    }
}

function fragmentMessage(message, maxFrameLength) {
    let frames = [];
    let currentFrameNumber = 1;
    
    // Fragmenta a mensagem em partes de tamanho adequado
    for (let i = 0; i < message.length; i += maxFrameLength) {
        let isLastFrame = (i + maxFrameLength) >= message.length;
        let frameData = message.slice(i, i + maxFrameLength);
        
        let frame = `${STX}${currentFrameNumber}${frameData}${isLastFrame ? ETX : ETB}`;
        
        // Calcula o checksum do frame
        const checksum = calculateChecksum(frame);
        frame += `${checksum}${CR}${LF}`;
        
        frames.push(frame);
        currentFrameNumber++;
    }

    return frames;
}

function sendMessage(socket, message) {
    const maxFrameLength = 240;  // Define o tamanho máximo do frame (240-250 caracteres)
    const framedMessages = fragmentMessage(message, maxFrameLength);
    
    framedMessages.forEach((framedMessage, index) => {
        socket.write(framedMessage);
        
    });
    socket.write(EOT);
}

function calculateChecksum(frame) {
    let checksum = 0;
    for (let i = 1; i < frame.length - 1; i++) {  // Ignora <STX> e <ETB>/<ETX> no cálculo
        checksum += frame.charCodeAt(i);
    }
    return (checksum % 256).toString(16).toUpperCase();
}


function sendASTMMessage(socket, message) {
    const STX = '\x02'; // Start of Text
    const ETX = '\x03'; // End of Text
    const CR = '\x0D'; // Carriage Return
    const LF = '\x0A'; // Line Feed
    const ENQ = '\x05'; // Enquiry
    const ACK = '\x06'; // Acknowledge
    const NAK = '\x15'; // Negative Acknowledge
    const EOT = '\x04'; // End of Transmission
    const ETB = '\x17'; // End of Transmission
    
    

    // Adiciona os delimitadores ASTM ao redor da mensagem
    const framedMessage = `${STX}${message}${ETX}${CR}${LF}`;

    // Calcula o checksum (soma de verificação) para a mensagem
    let checksum = 0;
    for (let i = 0; i < message.length; i++) {
        checksum += message.charCodeAt(i);
    }
    checksum = checksum % 256; // Checksum é um byte

    // Envia o frame formatado
    socket.write(framedMessage + checksum.toString(16).toUpperCase() + CR + LF);
}
/*
// Exemplo de uso ao receber conexão
const socket = new net.Socket();
socket.connect(5500, 'localhost', () => {

   
    // Exemplo de mensagem longa a ser enviada
    const result = 'H|\\^&|||Analyzer^1.0||123456789|||P|1394-97|202409291230' +
                    'P|1||PATIENT123||Doe^John||19850501|M|||A||Dr.Bean||' +
                    'O|1|Sample123|Order456|^^^Test1&Test2&Test3|R||202409291000' +
                    'R|1|^^^Test1|7.2|mg/dL|N||F' +
                    'R|2|^^^Test2|120|mg/dL|H||F' +
                    'R|3|^^^Test3|45|mg/dL|L||F' +
                    'L|1|N';
    
    // Enviar a mensagem longa, será fragmentada em frames ASTM
    //astmProtocol.sendMessage(message);
    

   // const message = 'H|\\^&|||Analyzer^1.0||1234|||P|1|202409291215';
    sendMessage(socket, result);
});
*/

