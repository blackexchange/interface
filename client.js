const net = require('net');
const client = new net.Socket();
const port = 8888;
const host = '127.0.0.1';

client.connect(port, host, function() {
    console.log('Connected to server');

    const msgOriginal =
    'MSH|^~\&|||||20240828151212||QRY^Q02|1|P|2.3.1||||||ASCII|||' +'\x0D'+
    'QRD|20240828151212|R|D|12|||RD|004|OTH|||T|'+'\x0D' +
    'QRF||||||RCT|COR|ALL||';
    const hl7Message = '\x0B' + 
    
    msgOriginal +
    
    '\x1C\x0D';

    client.write(hl7Message);

       
});

client.on('data', function(data) {
    console.log('Received: ' + data.toString());
    client.end(); // kill client after server's response
});

client.on('close', function() {
    console.log('Connection closed');
});
