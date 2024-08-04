const net = require('net');

const globalState = require('./global');

const utils = require('./utils');
const dbCon = require('./dbCon');


let message = '';
let header = '';
let headerCount = 0;
let sample = '';
let sampleOrders = '';

require('dotenv').config();

const db = require('./database');

const port = process.env.LIS_PORT;
const host = process.env.LIS_IP;
const equipment = process.env.LIS_ALIAS;
const fila = process.env.LIS_FILA;

const db_enabled = process.env.DB_ENABLED;

if (fila=='TRUE'){

    //setInterval(fetchData, 10000);
}




console.log('==== Analisador de Protocolo HL7 v2.0 By Neville =====' );

if (db_enabled=='TRUE'){
    dbCon.getEquipmentData(equipment).then(e=>{

        console.log(e[0] );
    });
    
}
    utils.sistemaValido().then(isValid => {
        if (!isValid) {
            console.log('Aplicação Expirada. Entre em contato com Rodney Neville. rodneyneville@gmail.com');
            process.exit(0);
        } else {
        
            // Aqui você pode continuar a execução do seu programa
        }
    });

    const server = net.createServer();
    server.listen(port, host, () => {

        console.log(`Servidor escutando na porta ${host}:${port}`);
    });

    server.on('connection', (socket) => {
        console.log('1. Conexão detectada.');

        socket.on('data', (data) => {
            console.log('2. Mensagens chegando na porta.');

            message = data.toString();
            utils.logMessage(message, 'EQP')

            console.log('Bloco Recebido:', message);
            if (message.startsWith('\x0B')) { // Start of message
                message = message.substring(1); // Remove <VT> character

                if (message.endsWith('\x1C\x0D')) { // End of message
                    message = message.substring(0, message.length - 2); // Remove <FS> character
                    processHL7Message(socket);
                }

            }else{
                message='';
            }
           


    
        });

        socket.on('end', () => {
            console.log('Cliente disconectado.');
        });
    });

async function processHL7Message(socket) {
    console.log('Processando Mensagem HL7...');
    console.log('Mensagem Recebida: ', message);

    const segments = message.split('\x0D'); // Divide a mensagem em segmentos por retorno de carro
    const responseSegments = [];


    for (const segment of segments) {
        const fields = segment.split('|');
        const segmentType = fields[0];

        switch (segmentType) {
            case 'MSH':
                processMSHSegment(segment);
                responseAck(socket);

                updateHeader();

                responseSegments.push(header);
                break;
            case 'QRD':
                sampleOrders = await processQRDSegment(fields);  // Espera pela resposta de processQRDSegment
                if (sampleOrders==''){
                    responseSegments.push(noExam());
                }else{
                    responseSegments.push(segment);
                }
                break;
            case 'QRF':
                if (sampleOrders!=''){

                    responseSegments.push(segment);
                    responseSegments.push(sampleOrders);

                }
                break;
            case 'PID':
                // Caso necessário, descomente e ajuste
                // responseSegments.push(processPIDSegment(fields));
                break;
            case 'OBR':
                // Caso necessário, descomente e ajuste
                // responseSegments.push(processOBRSegment(fields));
                break;
            case 'OBX':
                // Caso necessário, descomente e ajuste
                // responseSegments.push(processOBXSegment(fields));
                break;
            default:
                console.log(`Unknown segment type: ${segmentType}`);
                break;
        }
    }

    

    msgType = getMessageType(header);

    switch (msgType) {
        case 'QRY':
            console.log("==== QUERY DE AMOSTRA ====");
            responseMessage = `\x0B${responseSegments.join('\x0D')}\x1C\x0D`;
            break;

        case 'ORU':
            console.log("==== RESULTADO ====");
            break;

        default:
            console.log(`Tipo desconhecido: ${segmentType}`);
            break;
    }

   // const responseMessage = `\x0B${responseSegments.join('\x0D')}\x1C\x0D`;
    utils.logMessage(responseMessage,'LIS');
    socket.write(responseMessage);
    console.log('Responta enviada:', responseMessage);
    
}




function getMessageType(msh){
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

function processMSHSegment(message) {
    const segments = message.split('|'); 
    const messageType = segments[8];
    const msgSend = utils.incrementNumericPart(messageType)
    header =  `MSH|^~\&|${segments[4]}|${segments[4]}|${segments[2]}|${segments[3]}|${utils.getDateTime()}|${segments[7]}|${msgSend}||${segments[10]}|${segments[11]}|${segments[12]}||${segments[14]}|${segments[15]}|${segments[16]}|${segments[17]}|${segments[18]}|${segments[19]}|`;

    return header;
}

function responseAck(socket){
    console.log('Confirmando recebimento...');
    
    const ack = '\x0B'+  header + '\x0D' +
                'MSAA|AA|1|Mensagem Aceita||||0|' + '\x0D' + 
                'ERR|0|' + '\x0D' + 
                'QAK|SR|OK|' + '\x0D\x1C\x0D';

    utils.logMessage(ack, 'LIS')

    socket.write(ack);
}

function processPIDSegment(fields) {
    // Example: return a simple PID segment
    return `PID|1|${fields[1]}|${fields[3]}|${fields[5]}|${fields[5]}|...`;
}

function processOBRSegment(fields) {
    // Example: return an OBR segment
    return `OBR|1|${fields[1]}|${fields[3]}|${fields[4]}|...`;
}

function processOBXSegment(fields) {
    // Example: return an OBX segment with results
    return `OBX|1|NM|001^WBC^L|1|${fields[5]}|${fields[6]}|${fields[7]}|N|||F|||${new Date().toISOString()}`;
}

async function processQRDSegment(fields) {
    
    let dspRec='';

    if (db_enabled=='TRUE'){

        const sampleOrders = await dbCon.getSampleOrders(fields[7],equipment);


        if (sampleOrders.length > 0) {
            dspRec = 'DSP|1||HOSPITAL|||' + "\x0D" + 
                'DSP|2||1|||' + "\x0D" + //n quarto
                'DSP|3||'+sampleOrders[0].ord_patient?.toUpperCase()+'|||' + "\x0D" + //paciente
                'DSP|4||'+utils.formatDateTime(sampleOrders[0]?.ord_birthday)+'|||' + "\x0D" + //aniversario
                'DSP|5||'+sampleOrders[0].ord_gender?.toString()+'|||' + "\x0D" + //sexo 
                'DSP|6|||||' + "\x0D" + //tp sanguineo
                'DSP|7|||||' + "\x0D" + 
                'DSP|8|||||' + "\x0D" + 
                'DSP|9|||||' + "\x0D" + 
                'DSP|10|||||' + "\x0D" + 
                'DSP|12|||||' + "\x0D" + 
                'DSP|13|||||' + "\x0D" + 
                'DSP|14|||||' + "\x0D" + 
                'DSP|15||outpatient|||' + "\x0D" + //tipopaciente
                'DSP|16|||||' + "\x0D" + 
                'DSP|17|||||' + "\x0D" + 
                'DSP|18|||||' + "\x0D" + 
                'DSP|19|||||' + "\x0D" + 
                'DSP|20|||||' + "\x0D" + 
                'DSP|21||'+fields[7]+'|||' + "\x0D" + //codamostra
                'DSP|22||1|||' + "\x0D" + //sample id
                'DSP|23||'+utils.getDateTime()+'|||' + "\x0D" + //datahora 
                'DSP|24||'+sampleOrders[0].ord_urgent?.toString()+'|||' + "\x0D" + //emergencia
                'DSP|25|||||' + "\x0D" + 
                'DSP|26||'+sampleOrders[0].ord_sample_type?.toString()+'|||' + "\x0D" + //sample type
                'DSP|27||AUTO|||' + "\x0D" + 
                'DSP|28|||||' + "\x0D" ;

            const tests = sampleOrders[0].ord_test;
            
            return dspRec + formatResponse(tests);
        }else{
            return "";
        
    
        }
    }else{
        dspRec = 'DSP|1||HOSPITAL|||' + "\x0D" + 
                'DSP|2||1|||' + "\x0D" + //n quarto
                'DSP|3||ROBERTO|||' + "\x0D" + //paciente
                'DSP|4||19760606000000|||' + "\x0D" + //aniversario
                'DSP|5||M|||' + "\x0D" + //sexo 
                'DSP|6|||||' + "\x0D" + //tp sanguineo
                'DSP|7|||||' + "\x0D" + 
                'DSP|8|||||' + "\x0D" + 
                'DSP|9|||||' + "\x0D" + 
                'DSP|10|||||' + "\x0D" + 
                'DSP|12|||||' + "\x0D" + 
                'DSP|13|||||' + "\x0D" + 
                'DSP|14|||||' + "\x0D" + 
                'DSP|15||outpatient|||' + "\x0D" + //tipopaciente
                'DSP|16|||||' + "\x0D" + 
                'DSP|17|||||' + "\x0D" + 
                'DSP|18|||||' + "\x0D" + 
                'DSP|19|||||' + "\x0D" + 
                'DSP|20|||||' + "\x0D" + 
                'DSP|21||'+fields[7]+'|||' + "\x0D" + //codamostra
                'DSP|22||1|||' + "\x0D" + //sample id
                'DSP|23||'+utils.getDateTime()+'|||' + "\x0D" + //datahora 
                'DSP|24||N|||' + "\x0D" + //emergencia
                'DSP|25|||||' + "\x0D" + 
                'DSP|26||serum|||' + "\x0D" + //sample type
                'DSP|27||AUTO|||' + "\x0D" + 
                'DSP|28|||||' + "\x0D" ;
        
        return dspRec + await utils.getOrderFile();
    }
   
    
}


function noExam(){
    return "MSA|AA|1|Message Accepted|||0|\x0DERR|0|\x0DQAK|SR|NF|\x0D";
}

function formatResponse(tests) {
    const items = tests?.split(',');
    const formattedItems = items.map((item, index) => {
        const id = 29 + index;
        return `DSP|${id}|${item}^^^||||`;
    });

    return formattedItems.join('\x0D') + 
           "\x0DDSC||\x0D";
}




