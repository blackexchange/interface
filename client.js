const net = require('net');
const client = new net.Socket();
const port = 8888;
const host = '127.0.0.1';

client.connect(port, host, function() {
    console.log('Connected to server');
    // Send an HL7 message
    const hl7Message = '\x0B' + 

    //'MSH|^~\&|3|4|5|6|20240418124118|8|QRY^Q01|1|P|2.3.1|13|14|15|0|17|ASCII|19|20|' + '\x0D'+
    'MSH|^~\&|SendingAPP|Sender Facility|Receiving APP|Receiving Facility|20220124014108^S|NO SECURITY|QRY^Q01|2022012401410800828|T|2.3|000000000611811||AL|' + '\x0D'+
    'QRD|||||||111||||'+ '\x0D'+
    'QRF|1|O'+ '\x0D'+
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
