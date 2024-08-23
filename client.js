const net = require('net');
const client = new net.Socket();
const port = 8888;
const host = '127.0.0.1';

client.connect(port, host, function() {
    console.log('Connected to server');

    const msgOriginal =
    'MSH|^~\&|||||20240823103911||QRY^Q02|1|P|2.3.1||||||ASCII|||' +'\x0D'+
    'QRF||||||RCT|COR|ALL|||2|||RD|004|OTH|||T|'+'\x0D';
    // Send an HL7 message
    const hl7Message = '\x0B' + 
    
   // msgOriginal +
    'MSH|^~\&|SendingAPP|Sender Facility|Receiving APP|Receiving Facility|20220124014108^S|NO SECURITY|QRY^Q01|2022012401410800828|T|2.3|000000000611811||AL|' + '\x0D'+
    'QRD|||||||111||||'+ '\x0D'+
    'QRF|1|O'+ 
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
