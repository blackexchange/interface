const utils = require('../../utils/utils');

class HL7Processor {
    constructor() {
        this.socket = null; // Variável de instância para o socket
        this.ackMessage = [];
        this.responseSegments = [];
        this.msgType = null;
        this.lastHeaderReceived = null;
        this.isProcessing = false;
    }

    async processData(message, device, socket) {

        if (this.isProcessing){
            return;
        }

        this.isProcessing = true;
        
        this.socket = socket; // Armazenando o socket na instância
        if (message.startsWith('\x0B')) {

            message = message.substring(1); // Remove <VT> character

            if (message.endsWith('\x1C\x0D')) {
                message = message.substring(0, message.length - 2); // Remove <FS> character
                await this.processHL7Message(message);
                await this.processACKMessage();
                await this.processResponseMessage();

            }
        } else {
            message = '';
        }

        this.isProcessing = false;
    }

    async processHL7Message(message) {
        console.log('Processando Mensagem HL7...');
        console.log('Mensagem Recebida: ', message);

        const segments = message.split('\x0D');
        //const responseSegments = [];

        for (const segment of segments) {
            const fields = segment.split('|');
            const segmentType = fields[0];

            // Use os handlers de segmentos como no exemplo anterior
            switch (segmentType) {
                case 'MSH':
                    this.processMSHSegment(fields, segment);
                    break;
                case 'QRD':
                    await this.processQRDSegment(fields, segment);
                    break;
                case 'QRF':
                    await this.processQRFSegment(fields, segment);
                    break;
                default:
                    console.log(`Unknown segment type: ${segmentType}`);
                    break;
            }
        }

        // Envie a resposta usando o socket armazenado na instância
    }
    


    buildHL7Response(segments) {
        return `\x0B${segments.join('\x0D')}\x1C\x0D`;
    }

    async sendResponse(message) {
        return new Promise((resolve, reject) => {
            this.socket.write(message, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    processMSHSegment(fields, responseSegments) {
        this.lastHeaderReceived = responseSegments
        this.msgType = getMessageType(fields.join('|'));
        let segments = fields;
        
        const senderName = segments[2];
        const senderApp = segments[3];
    
        segments[2] = segments[4];
        segments[3] = segments[5];
    
        segments[4] = senderName;
        segments[5] = senderApp;
    
        segments[8] = utils.incrementNumericPart(segments[8]);
    
        //header = segments.join("|");
    
       // responseAck(socket);
        //updateHeader();
        this.responseSegments.push(responseSegments);
    }

    async processQRDSegment(fields, responseSegments) {
        // Processamento do segmento QRD
    }

    async processQRFSegment(fields, responseSegments) {
        // Processamento do segmento QRD
    }

    
    processACKMessage() {
        console.log('Confirmando recebimento...');
        const id = header.split('|')[9];

        const ack = '\x0B' + header + '\x0D' +
                    'MSAA|AA|' + id + '|Mensagem Aceita||||0|' + '\x0D' +
                    'ERR|0|' + '\x0D' + 
                    'QAK|SR|OK|' + '\x0D\x1C\x0D';

        utils.logMessage(ack, 'LIS');
        this.socket.write(ack);
    }

    processResponseMessage() {
        if (this.responseSegments.length > 0){

            const responseMessage = buildHL7Response(this.responseSegments);
            this.sendResponse(responseMessage);

        }
      
    }

}


/*

module.exports = {

    processData: async (message, device, socket) => {

        if (message.startsWith('\x0B')) { // Start of message
            message = message.substring(1); // Remove <VT> character

            if (message.endsWith('\x1C\x0D')) { // End of message
                message = message.substring(0, message.length - 2); // Remove <FS> character
                await processHL7Message(message, socket);
            }

        } else {
            message = '';
        }

    }
};
*/
async function processHL7Message(message, socket) {
    console.log('Processando Mensagem HL7...');
    console.log('Mensagem Recebida: ', message);

    const segments = message.split('\x0D'); // Divide a mensagem em segmentos por retorno de carro
    const responseSegments = [];

    let response = true;
    let msgType = '';

    const segmentHandlers = {
        'MSH': processMSHSegment,
        'QRD': processQRDSegment,
        'QRF': processQRSSegment,
        'PID': processPIDSegment,
        'OBR': processOBRSegment,
        'OBX': processOBXSegment,
    };

    for (const segment of segments) {
        const fields = segment.split('|');
        const segmentType = fields[0];

        if (segmentHandlers[segmentType]) {
            await segmentHandlers[segmentType](fields, responseSegments);
        } else if (segmentType === 'QRF' && sampleOrders !== '') {
            responseSegments.push(segment);
            responseSegments.push(sampleOrders);
        } else {
            console.log(`Unknown segment type: ${segmentType}`);
        }
    }

    switch (msgType) {
        case 'QRY':
            console.log("==== QUERY DE AMOSTRA ====");
            const responseMessage = buildHL7Response(responseSegments);
            await sendResponse(socket, responseMessage);
            break;
        case 'ORU':
            console.log("==== RESULTADO ====");
            break;
        case 'ACK':
            response = false;
            console.log("==== ACEITE ====");
            break;
        default:
            response = false;
            break;
    }

    if (response) {
        const responseMessage = buildHL7Response(responseSegments);
        utils.logMessage(responseMessage, 'LIS');
        await sendResponse(socket, responseMessage);
        console.log('Resposta enviada:', responseMessage);
    }
}

function buildHL7Response(segments) {
    return `\x0B${segments.join('\x0D')}\x1C\x0D`;
}

function getMessageType(msh) {
    const fields = msh.split('|');
    const messageType = fields[8].split('^');
    return messageType[0];
}

function updateHeader() {
    let segments = header.split('|');
    segments[6] = utils.getDateTime();
    segments[8] = utils.incrementNumericPart(segments[8]);
    header = segments.join("|");
}

function processMSHSegment(fields, responseSegments) {
    this.msgType = getMessageType(fields.join('|'));
    let segments = fields;
    
    const senderName = segments[2];
    const senderApp = segments[3];

    segments[2] = segments[4];
    segments[3] = segments[5];

    segments[4] = senderName;
    segments[5] = senderApp;

    segments[8] = utils.incrementNumericPart(segments[8]);

    this.header = segments.join("|");

    responseAck();
    updateHeader();
    responseSegments.push(header);
}

async function processQRDSegment(fields, responseSegments) {
    console.log("processando envio de query...");
    let dspRec = '';
    let db_enabled = 'FALSE';

    if (db_enabled === 'TRUE') {
        const sampleOrders = await dbCon.getSampleOrders(fields[7], equipment);

        if (sampleOrders.length > 0) {
            dspRec = formatSampleOrderResponse(sampleOrders);
            responseSegments.push(dspRec);
        } else {
            responseSegments.push(noExam());
        }
    } else {
        dspRec = createDefaultResponse(fields[7]);
        responseSegments.push(dspRec);
    }
}

function processPIDSegment(fields, responseSegments) {
    responseSegments.push(`PID|1|${fields[1]}|${fields[3]}|${fields[5]}|${fields[5]}|...`);
}

function processOBRSegment(fields, responseSegments) {
    responseSegments.push(`OBR|1|${fields[1]}|${fields[3]}|${fields[4]}|...`);
}

function processOBXSegment(fields, responseSegments) {
    responseSegments.push(`OBX|1|NM|001^WBC^L|1|${fields[5]}|${fields[6]}|${fields[7]}|N|||F|||${new Date().toISOString()}`);
}

function responseAck() {
    console.log('Confirmando recebimento...');
    const id = header.split('|')[9];

    const ack = '\x0B' + header + '\x0D' +
                'MSAA|AA|' + id + '|Mensagem Aceita||||0|' + '\x0D' +
                'ERR|0|' + '\x0D' + 
                'QAK|SR|OK|' + '\x0D\x1C\x0D';

    utils.logMessage(ack, 'LIS');
    this.socket.write(ack);
}

function noExam() {
    return "MSA|AA|1|Message Accepted|||0|\x0DERR|0|\x0DQAK|SR|NF|\x0D";
}

function formatSampleOrderResponse(sampleOrders) {
    let dspRec = 'DSP|1||HOSPITAL|||' + "\x0D" +
                 'DSP|2||1|||' + "\x0D" +
                 'DSP|3||' + sampleOrders[0].ord_patient?.toUpperCase() + '|||' + "\x0D" +
                 'DSP|4||' + utils.formatDateTime(sampleOrders[0]?.ord_birthday) + '|||' + "\x0D" +
                 'DSP|5||' + sampleOrders[0].ord_gender?.toString() + '|||' + "\x0D" +
                 'DSP|26||' + sampleOrders[0].ord_sample_type?.toString() + '|||' + "\x0D";

    return dspRec + formatResponse(sampleOrders[0].ord_test);
}

function createDefaultResponse(sampleId) {
    return 'DSP|1||HOSPITAL|||' + "\x0D" +
           'DSP|2||1|||' + "\x0D" +
           'DSP|3||ROBERTO|||' + "\x0D" +
           'DSP|4||19760606000000|||' + "\x0D" +
           'DSP|5||M|||' + "\x0D" +
           'DSP|21||' + sampleId + '|||' + "\x0D";
}

function formatResponse(tests) {
    const items = tests?.split(',');
    const formattedItems = items.map((item, index) => {
        const id = 29 + index;
        return `DSP|${id}|${item}^^^||||`;
    });

    return formattedItems.join('\x0D') + "\x0DDSC||\x0D";
}

function sendResponse(socket, message) {
    return new Promise((resolve, reject) => {
        socket.write(message, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}


module.exports = HL7Processor;
