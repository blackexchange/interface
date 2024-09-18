const { split } = require('lodash');
const net = require('net');
const client = new net.Socket();
const port = 16062;
const host = '127.0.0.1';

client.connect(port, host, function() {
    console.log('Connected to server');

    const msgOriginal =
    'MSH|^~\&|||||20240828151212||QRY^Q02|1|P|2.3.1||||||ASCII|||' +'\x0D'+
    'QRD|20240828151212|R|D|12|||RD|004|OTH|||T|'+'\x0D' +
    'QRF||||||RCT|COR|ALL||';


    
    const result = 'MSH|^~\&|||||20240418124118||ORU^R01|790|P|2.3.1||||0||ASCII|||\r'+
    'PID|2||||SILVONEI DA HORA|||M||||||||||||||||||SV|||||\r'+  
    'OBR|2|SILVONEIN 5H|3721|^|N|20240418055923|20240418055748|20240418053500||1^8||||20240418055748|Soro|||||||||||||||||||||||||||||||||\r'+  
    'OBX|1|NM||Amilas 405 AA l?quida|53.431886|U/L|-|N|||F||53.431886|20240418063007|||0||\r'+  
    'OBX|2|NM||Creatinina cin?tica AA l?quida - Tca. compensada|0.962758|mg/dL|-|N|||F||0.962758|20240418063201|||0|SLP|\r'+  
    'OBX|3|NM||GOT (AST) UV AA l?quida|26.364326|U/L|-|N|||F||26.364326|20240418063448|||0||\r'+  
    'OBX|4|NM||GPT (ALT) UV AA l?quida|15.917416|U/L|-|N|||F||15.917416|20240418063454|||0||\r'+  
    'OBX|5|NM||Urea UV cin?tiCA AA l?quida|39.252194|mg/dL|-|N|||F||39.252194|20240418063254|||0||\r'+  
    'OBX|6|NM||Na|138.060280|mmol/L|-|N|||F||138.060280|20240418062352|||0||\r'+  
    'OBX|7|NM||K|3.291110|mmol/L|-|N|||F||3.291110|20240418062352|||0|SLP,v|';

    const hl7Message = '\x0B' + 
    
    result +
    
    '\x1C\x0D';

    client.write(hl7Message);

       
});

let dataBuffer = ''; // Buffer para armazenar os dados recebidos

client.on('data', function(data) {
    const messageChunk = data.toString('utf8');
    dataBuffer += messageChunk; // Acumula o chunk no buffer

    console.log('Received: ' + data);


    // Verifica se o delimitador de fim (\x1C\r) está presente
    if (dataBuffer.includes(String.fromCharCode(0x1C) + '\r')) {
        // Mensagem completa recebida

        let a = dataBuffer.split("\r")
        console.log('Received: ' + a);

        // Processa a mensagem completa
        // Resetar o buffer após o processamento, caso mais mensagens sejam esperadas
        dataBuffer = '';

        // Encerra a conexão
        client.end(); // kill client after server's response
    }
});

client.on('close', function() {
    console.log('Connection closed');
});
