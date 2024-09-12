const net = require('net');

// ORU^R01 HL7 message to be sent to the server
const hl7Message = `\x0BMSH|^~\\&|Analyzer|Company|LIS|Lab|20230911120000||ORU^R01|12345|P|2.3.1|ASCII\r
PID|||19851001000000||Mike||19851001|M\r
OBR|||12345678||Company^Product|Y|20230913093253|serum|||||||Y||20230913093253|||serum\r
OBX|1|NM|TBil|00|100|umol/L||N||F|20230913093253\r
OBX|2|NM|ALT|98.2|umol/L||N||F|20230913093253\r
OBX|3|NM|AST|26.4|umol/L||N||F|20230913093253\r
\x1C\r`;

// Connect to the HL7 server
const client = new net.Socket();
client.connect(3100, '127.0.0.1', () => {
    console.log('Conectado ao servidor HL7');
    client.write(hl7Message);
});

// Receive the response from the server
client.on('data', (data) => {
    console.log('Resposta do servidor:', data.toString());
    client.destroy(); // Fechar a conexão
});

client.on('close', () => {
    console.log('Conexão encerrada');
});

client.on('error', (err) => {
    console.error(`Erro na conexão: ${err.message}`);
});
