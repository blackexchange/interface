const net = require('net');
const fs = require('fs');

const globalState = require('./global');

let message = '';
let header = '';
let sample = '';
let sampleOrders = '';

require('dotenv').config();

const db = require('./database');

const port = process.env.LIS_PORT;
const host = process.env.LIS_IP;
const equipment = process.env.LIS_ID;

const db_enabled = process.env.DB_ENABLED;

if (db_enabled=='TRUE'){

    //setInterval(fetchData, 10000);
}

console.log('==== Analisador de Protocolo HL7 v2.0 By Neville =====' );

    sistemaValido().then(isValid => {
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
            logMessage(message, 'EQP')

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

 

function logMessage(message, direction) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} \t${direction} \t${message}\n-----------------------------------------------\n`;
    
    // Escreve no arquivo de log, criando o arquivo se não existir, ou anexando se já existir
    fs.appendFile('server_log.txt', logMessage, err => {
        if (err) throw err;
        console.log('Log gerado no arquivo server_log.txt!');
    });
}


function responseAck(socket){
    console.log('Confirmando recebimento...');

    const ack = '\x0B'+ header + '\x0D' +
                'MSAA|AA|1|Mensagem Aceita||||0|' + '\x0D' + 
                'ERR|0|' + '\x0D' + 
                'QAK|SR|OK|' + '\x0D\x1C\x0D';

    logMessage(ack, 'LIS')

    socket.write(ack);
}

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
                header = processMSHSegment(fields);
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

    
    responseAck(socket);

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
    logMessage(responseMessage,'LIS');
    socket.write(responseMessage);
    console.log('Responta enviada:', responseMessage);
    
}



function incrementNumericPart(inputString) {
    // Encontrar e capturar o segmento numérico no final da string
    return inputString.replace(/(\d+)$/, (match) => {
        // Converter o segmento numérico para um número, incrementar e converter de volta para string
        const number = parseInt(match, 10) + 1;
        // Manter o mesmo número de dígitos (preenchendo com zeros se necessário)
        return number.toString().padStart(match.length, '0');
    });
}

function getMessageType(msh){
    const fields = msh.split('|'); 
    const messageType = fields[8].split('^');
    return messageType[0];
}

function processMSHSegment(fields) {
    const segments = message.split('|'); 
    const messageType = segments[8];
    const msgSend = incrementNumericPart(messageType)

    return `MSH|^~\&|${segments[4]}|${segments[4]}|${segments[2]}|${segments[3]}|${getDateTime()}^S|${segments[7]}|${msgSend}|${getDateTime()}|${segments[10]}|${segments[11]}|${segments[12]}||${segments[14]}|`;
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
    const sampleOrders = await getSampleOrders(fields[7]);

    if (sampleOrders.length > 0) {
        const tests = sampleOrders[0].ord_test;
        return formatResponse(tests);
    }else{
        return "";
    

    }
    
    
}

async function processQRFSegment(fields) {

}

function noExam(){
    return "MSA|AA|1|Message Accepted|||0|\x0DERR|0|\x0DQAK|SR|NF|\x0D";
}

function formatResponse(tests) {
    const items = tests?.split(',');
    const formattedItems = items.map((item, index) => {
        const id = 29 + index;
        return `DSP|${id}|${item}||||`;
    });

    return formattedItems.join('\x0D') + 
           "\x0DDSC||\x0D";
}


function getDateTime() {
    const isoDate = new Date().toISOString(); // Exemplo: "2024-08-03T18:02:55.978Z"
    const basicDateTime = isoDate
        .replace(/-|:|\..*|Z/g, '') // Remove hifens, dois pontos, a fração de segundo e o 'Z'
        .slice(0, 14); // Garante que apenas os primeiros 14 caracteres (YYYYMMDDHHMMSS) sejam pegos
    return basicDateTime;
}

async function sistemaValido() {

    const specificDate = new Date('2024-08-10T00:00:00Z');
  
    try {
        const date = await getNetworkTime();
        // Verificar a data - exemplo: verificar se a data é após 10 de agosto de 2024
        const ret = specificDate > date ;
        return  ret ;
    } catch (error) {
        console.error("Erro ao obter a hora do servidor NTP:", error);
    }

}

 function getNetworkTime() {
    const ntpClient = require('ntp-client');

    return new Promise((resolve, reject) => {
        ntpClient.getNetworkTime("time.google.com", 123, (err, date) => {
            if (err) {
                reject(err);
            } else {
                resolve(date);
            }
        });
    });
}

async function fetchData() {
    try {
        // Executar a consulta usando o pool; não é necessário chamar db.connect() ou db.close()
        const results = await db.query('SELECT * FROM ord WHERE ord_status="N" AND ord_eqp_id=1');
        console.log('Obtendo folha...');
        
        // Supondo que globalState seja um módulo já definido e importado para manter o estado global
        globalState.setData({ 'users': results });

        console.log(results);
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
    }
}


async function getSampleOrders(sample) {
    try {
        // Executar a consulta usando o pool; não é necessário chamar db.connect() ou db.close()
        const results = await db.query(`SELECT * FROM ord WHERE ord_status="N" AND ord_sample="${sample}" AND ord_eqp_id=${equipment}`);
        console.log('Obtendo folha da amostra ');
        return results;

    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
    }
}

function getHL7Field(message,number){
    const segments = message.split('|'); 
    return segments[number];
}

