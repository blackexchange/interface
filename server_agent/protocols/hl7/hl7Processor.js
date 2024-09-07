module.exports = {
    processData: (data, device) => {

        console.log(data.toString())

        return "Dados"
        // Lógica de processamento específica para o protocolo HL7
        //console.log(`Processando dados HL7 do dispositivo ${device.deviceId}`);
        // Parse do dado HL7 aqui...
    }
};


async function processHL7Message(socket) {
    console.log('Processando Mensagem HL7...');
    console.log('Mensagem Recebida: ', message);

    const segments = message.split('\x0D'); // Divide a mensagem em segmentos por retorno de carro
    const responseSegments = [];

    let response = true;

    for (const segment of segments) {
        const fields = segment.split('|');
        const segmentType = fields[0];

        switch (segmentType) {
            case 'MSH':
                msgType = getMessageType(segment);
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
                   // updateHeader();

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
            case '':
                break;
            default:
               
                console.log(`Unknown segment type: ${segmentType}`);
                break;
        }
    }

    



    switch (msgType) {
        case 'QRY':
            console.log("==== QUERY DE AMOSTRA ====");
            responseMessage = `\x0B${responseSegments.join('\x0D')}\x1C\x0D`;
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

    // const responseMessage = `\x0B${responseSegments.join('\x0D')}\x1C\x0D`;
        utils.logMessage(responseMessage,'LIS');
        socket.write(responseMessage);
        console.log('Responta enviada:', responseMessage);
    }
    
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
    let segments = message.split('|');

    const senderName = segments[2] 
    const senderApp  =  segments[3]
    
    segments[2] = segments[4];
    segments[3] = segments[5];
    
    segments[4] = senderName;
    segments[5] = senderApp;
    
    //segments[6] = utils.getDateTime();
    
    segments[8] = utils.incrementNumericPart(segments[8]);
    
    header = segments.join("|");

   // header =  `MSH|^~\&|${segments[4]}|${segments[4]}|${segments[2]}|${segments[3]}|${utils.getDateTime()}|${segments[7]}|${msgSend}||${segments[10]}|${segments[11]}|${segments[12]}||${segments[14]}|${segments[15]}|${segments[16]}|${segments[17]}|${segments[18]}|${segments[19]}|`;

    //return header;
}

function responseAck(socket){
    console.log('Confirmando recebimento...');
    const id = header.split('|')[9];
    
    const ack = '\x0B'+  header + '\x0D' +
                'MSAA|AA|'+id+'|Mensagem Aceita||||0|' + '\x0D' + 
                'ERR|0|' + '\x0D' + 
                'QAK|SR|OK|' + '\x0D\x1C\x0D';

//                const ack = '\x0B'+  header + '\x0D' + 'MSA|AA|'+id+'|' + '\x0D\x1C\x0D';
    
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
    console.log("processando envio de query...");
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




