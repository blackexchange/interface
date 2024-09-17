const net = require('net');
const Logger = require('../utils/Logger');
const { parseHL7MessageToJSON, serializeHL7MessageFromJSON , getCurrentTimestamp} = require('../utils/hl7Helper');


class HL7Protocol {
    constructor(device) {
        this.device = device;
        this.isConnected = false;
        this.retryCount = 0;
        this.messageQueue = [];
        this.acknowledgementQueue = [];
        this.timeOut = 10;
        this.lastMessageReceived = {};
    }

    // Método para iniciar conexão como cliente ou servidor com base no papel (role)
    startTCPConnection() {
        if (this.device.role === 'server') {
            this.startTCPServer();
        } else if (this.device.role === 'client') {
            this.connectTCPClient();
        } else {
            Logger.log('Papel (role) desconhecido para o dispositivo (HL7)', 'ERROR');
        }
    }

    // Método para conectar como cliente TCP
    connectTCPClient() {
        this.client = new net.Socket();

        this.client.connect(this.device.port, this.device.host, () => {
            this.isConnected = true;
            Logger.log(`Conectado ao dispositivo HL7 em ${this.device.host}:${this.device.port}`);
        });

        this.client.on('data', (data) => {
            Logger.log(`Mensagem recebida (HL7 Cliente): ${data}`);
            this.receiveMessage(data);
        });

        this.client.on('close', () => {
            this.isConnected = false;
            Logger.log('Conexão encerrada (HL7)');
        });

        this.client.on('error', (err) => {
            this.isConnected = false;
            this.connectionErrorHandler(err);
        });

        return this.client;
    }

    // Método para iniciar um servidor TCP
    startTCPServer() {
        this.server = net.createServer((socket) => {
            this.isConnected = true;
            this.messageQueue = [];
            Logger.log(`Cliente conectado a partir de ${socket.remoteAddress}:${socket.remotePort}`,this.device);

            socket.on('data', (data) => {
                Logger.log(`Mensagem recebida : ${data}`);
                this.receiveMessage(data);

                this.messageQueue.forEach(msg => {
                    socket.write(msg,() => {
                    Logger.log(`Mensagem enviada : ${msg}`);

                    });
                });
                this.messageQueue = [];
                
            });

            socket.on('close', () => {
                this.isConnected = false;
                Logger.log('Cliente desconectado (HL7 Server)');
            });

            socket.on('error', (err) => {
                this.isConnected = false;
                
                this.connectionErrorHandler(err);
            });
        });

        this.server.listen(this.device.port, this.device.host, () => {
            Logger.log(`Servidor HL7 ouvindo em ${this.device.host}:${this.device.port}`);
        });

        this.server.on('error', (err) => {
            Logger.log(`Erro no servidor HL7: ${err.message}`, 'ERROR');
        });
    }

    disconnect() {
        if (this.device.role === 'client' && this.client) {
            this.client.destroy();
            this.isConnected = false;
            Logger.log('Desconectado do dispositivo HL7 (cliente)');
        } else if (this.device.role === 'server' && this.server) {
            this.server.close();
            Logger.log('Servidor HL7 encerrado');
        }
    }

    // Método para enviar uma mensagem
    sendMessage(message) {
        // Serializa a mensagem JSON para o formato HL7
        const hl7Message = serializeHL7MessageFromJSON(message);
        let formattedMessage= String.fromCharCode(0x0B) + hl7Message + String.fromCharCode(0x1C) + '\r';

        Logger.log(`Mensagem enviada (HL7): ${formattedMessage}`);
        
        if (this.isConnected) {
            this.messageQueue.push(formattedMessage);
        } else {
            Logger.log('Dispositivo não está conectado (HL7)', 'ERROR');
        }
    }

    // Método para receber e processar mensagens HL7
    receiveMessage(data) {
        try {
            const messageBuffer = Buffer.from(data);

            // Verifica se a mensagem contém os delimitadores válidos
            if (messageBuffer[0] === 0x0B && messageBuffer[messageBuffer.length - 2] === 0x1C && messageBuffer[messageBuffer.length - 1] === 0x0D) {
                // Remove os delimitadores
                const trimmedBuffer = messageBuffer.subarray(1, messageBuffer.length - 2);
                const rawMessage = trimmedBuffer.toString('utf8').replace(/\n/g, '');
                //const rawMessage = parseHL7MessageToJSON(trimmedBuffer);

                // Processa a mensagem HL7 usando a biblioteca hl7
                const parsedMessage = parseHL7MessageToJSON(rawMessage);
                this.lastMessageReceived = parsedMessage;
             
                Logger.log(`Mensagem decodificada (HL7): ${JSON.stringify(parsedMessage)}`);

                // Identifica o tipo de mensagem e chama o processador correspondente
                const messageType = parsedMessage?.MSH[0]?.field8 || ''; // Acessa o campo 9 do segmento MSH

                switch (messageType) {
                    case 'ORU^R01':
                        this.processORU_R01();
                        break;
                    case 'QRY^Q02':
                        this.processQRY_Q02();
                        break;
                    default:
                        Logger.log(`Tipo de mensagem não reconhecido: ${messageType}`, 'ERROR');
                }
            } else {
                throw new Error("Mensagem recebida não contém delimitadores válidos de início e fim");
            }
        } catch (err) {
            Logger.log(`Erro ao processar recebimento de mensagem HL7: ${err.message}`, 'ERROR');
        }
    }

    processORU_R01() {
        let message = this.lastMessageReceived;
        const patientName = message.PID[0]?.field5 || ''; // No PID segmento, campo 5 está o nome do paciente
        const testResults = message.OBX || []; // Acessa todos os segmentos OBX (resultados de observação)

        Logger.log(`Nome do Paciente: ${patientName}`);

        testResults.forEach(result => {
            const testName = result.field3; // Nome do teste
            const testValue = result.field4; // Valor do teste
            const unit = result.field5; // Unidade do teste
            Logger.log(`Resultado do teste ${testName}: ${testValue} ${unit}`);
        });

        // Envia o ACK
        const ackMessage = this.createACKResponse(); // Pega o ID da mensagem original para incluir no ACK
       
        this.sendMessage(ackMessage);
    }

    processQRY_Q02() {

        let message = this.lastMessageReceived;
        const amostra = message.QRD[0]?.field8 || ''; // No PID segmento, campo 5 está o nome do paciente

        Logger.log(`Query: ${amostra}`);

        const worklist = [{
            barCode: "12212",
            name: "ROnaldo",
            sex:"M",
            material:"serum",
            exams: [{exam:"EXAM1"}, {exam:"EXAM2"}, {exam:"EXAM3"}, {exam:"EXAM4"}] // Exemplo de exames
        }];
 
     
        // Envia o ACK
        const ackMessage = this.createQCKResponse(worklist.length>0); // Pega o ID da mensagem original para incluir no ACK
       
        this.sendMessage(ackMessage);

        if (worklist.length>0){

            this.processDSR_Q03(worklist[0]);


        }
    }

    processDSR_Q03(worklist) {

        let message = this.lastMessageReceived;
        const barCode = message.QRD[0]?.field8 || ''; // No PID segmento, campo 5 está o nome do paciente

        Logger.log(`Amostra: ${barCode}`);


        const dsrResponse = this.createDSRResponse(worklist); // Pega o ID da mensagem original para incluir no ACK

        this.sendMessage(dsrResponse);

    }

    createACKResponse() {
        let MSH = {
            MSH:{
                field0 : "MSH",
                field1 : this.lastMessageReceived.MSH[0].field1,
                field2 : this.lastMessageReceived.MSH[0].field3,
                field3 : this.lastMessageReceived.MSH[0].field2,
                field4 : this.lastMessageReceived.MSH[0].field5,
                field5 : this.lastMessageReceived.MSH[0].field4,
                field6 : this.getCurrentTimestamp(),
                field7 : this.lastMessageReceived.MSH[0].field7,
                field8 : "ACK^R01"}
            
        };            


        let MSA = { "MSA":{
            field0:"MSA",
            field1:"AA",
            field2: this.lastMessageReceived.MSH[0].field9,
            field3:"SUCCESS",
            field4:"",
            field5:"",
            field6:"0",
            field7:""}
        }

        const ackMessage =[MSH,MSA];
        
        return ackMessage;
    }

    createQCKResponse(noexam = false) {
        let MSH = {
            MSH:{
                field0 : "MSH",
                field1 : this.lastMessageReceived.MSH[0].field1,
                field2 : this.lastMessageReceived.MSH[0].field3,
                field3 : this.lastMessageReceived.MSH[0].field2,
                field4 : this.lastMessageReceived.MSH[0].field5,
                field5 : this.lastMessageReceived.MSH[0].field4,
                field6 : this.getCurrentTimestamp(),
                field7 : this.lastMessageReceived.MSH[0].field7,
                field8 : "QCK^Q02"}
            
        };            


        let MSA = { "MSA":{
            field0:"MSA",
            field1:"AA",
            field2: this.lastMessageReceived.MSH[0].field9,
            field3:"SUCCESS",
            field4:"",
            field5:"",
            field6:"0",
            field7:""}
        }
        let ERR = { "ERR":{
            field0:"ERR",
            field1:"0"}
        }

        let QAK = { "QAK":{
            field0:"QAK",
            field1: `${noexam ? "NF":"OK"}`,
            field2: "OK",
            field3:""}
        }

        const ackMessage =[MSH,MSA,ERR,QAK];
        
        return ackMessage;
    }

    

    createDSRResponse(worklist) {

        const totalExam =worklist.exams.length; 
        const examList = worklist.exams.map((exam, index) => {
            return {DSP:{
                    field0: "DSP",
                    field1: (29 + index).toString(), // Incrementa a partir de 29
                    field2: "",
                    field3: "",
                    field4: exam.exam + "^^^", // Insere o nome do exame no field4
                    field5: ""
            }};
        });

        const MSH = {
            MSH:{
                field0 : "MSH",
                field1 : this.lastMessageReceived.MSH[0].field1,
                field2 : this.lastMessageReceived.MSH[0].field3,
                field3 : this.lastMessageReceived.MSH[0].field2,
                field4 : this.lastMessageReceived.MSH[0].field5,
                field5 : this.lastMessageReceived.MSH[0].field4,
                field6 : this.getCurrentTimestamp(),
                field7 : this.lastMessageReceived.MSH[0].field7,
                field8 : "DSR^Q03"}
            
        };   

        const QRD = {
            QRD:this.lastMessageReceived.QRD[0]
        };  

        const QRF = {
            QRF:this.lastMessageReceived.QRF[0]
        };   
        
        let DSP = [
            { DSP: { field0: "DSP", field1: "1", field2: "", field3: worklist?.admissionNumber, field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "2", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "3", field2: "", field3: worklist?.name, field4:"", field5: "" } },
            { DSP: { field0: "DSP", field1: "4", field2: "", field3: worklist?.dateOfBirth, field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "5", field2: "", field3: worklist?.sex, field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "6", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "7", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "8", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "9", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "10", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "11", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "12", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "13", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "14", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "15", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "16", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "17", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "18", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "19", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "20", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "21", field2: "", field3: worklist.barCode, field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "22", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "23", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "24", field2: "", field3: "N", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "25", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "26", field2: "", field3: worklist?.material, field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "27", field2: "", field3: "", field4: "", field5: "" } },
            { DSP: { field0: "DSP", field1: "28", field2: "", field3: "", field4: "", field5: "" } }
        ];
        DSP = DSP.concat(examList, { DSC: { field0: "DSC", field1: `${totalExam + 29}`, field2: "" } });
        


       
        const drsResponse =[MSH,QRD,QRF,DSP];
        
        return drsResponse;
    }

    async getWorkList(barCode) {

      
        Logger.log(`Buscando: ${barCode}`);

        // Envia o ACK
      //  const ackMessage = this.createDSRResponse(); // Pega o ID da mensagem original para incluir no ACK
       
      //  this.sendMessage(ackMessage);
    }



    processQueryRequest(message) {
        Logger.log("Processando QRY^Q02...");
        const barcode = message.OBR?.[3] || ''; // Acessa o código de barras da amostra
        Logger.log(`Código de barras da amostra: ${barcode}`);

        // Envia uma resposta QCK^Q02 (confirmação de recebimento)
        const qckResponse = this.createQCKResponse();
        this.sendMessage(qckResponse);
    }


    connectionErrorHandler(err) {
        Logger.log(`Erro de conexão (HL7): ${err.message}`, 'ERROR');
    }

    testConnection() {
        Logger.log('Verificando conexão com o dispositivo HL7...');
        return this.isConnected;
    }

    setTimeout(timeout) {
        if (this.device.role === 'client' && this.client) {
            this.client.setTimeout(timeout, () => {
                Logger.log('Timeout atingido na conexão HL7');
                this.disconnect();
            });
        } else if (this.device.role === 'server') {
            Logger.log('Timeout não implementado para servidor HL7', 'WARN');
        }
    }
}

module.exports = HL7Protocol;
