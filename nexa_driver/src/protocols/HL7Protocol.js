const TCPBase = require('./TCPBase'); // Classe base de comunicação TCP
const { parseHL7MessageToJSON, serializeHL7MessageFromJSON, getCurrentTimestamp,getControl } = require('../utils/helper');
const Logger = require('../utils/Logger');

class HL7Protocol extends TCPBase {
    constructor(device) {
        super(device); // Chama o construtor da classe base
    }
    

    // Sobrescreve o método para processar as mensagens recebidas
    receiveMessage(data) {
        try {
            const messageBuffer = Buffer.from(data);

            // Verifica se a mensagem contém os delimitadores válidos
            if (messageBuffer[0] === 0x0B && messageBuffer[messageBuffer.length - 2] === 0x1C && messageBuffer[messageBuffer.length - 1] === 0x0D) {
                const trimmedBuffer = messageBuffer.subarray(1, messageBuffer.length - 2);
                const rawMessage = trimmedBuffer.toString('utf8').replace(/\n/g, '');

                const parsedMessage = parseHL7MessageToJSON(rawMessage);
                this.lastMessageReceived = parsedMessage;

               // Logger.log(`Mensagem decodificada (HL7): ${JSON.stringify(parsedMessage)}`);

                const messageType = parsedMessage?.MSH?.[0]?.field8 || '';

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
        const message = this.lastMessageReceived;
        const patientName = message.PID[0]?.field5 || '';
        const testResults = message.OBX || [];

        Logger.log(`Nome do Paciente: ${patientName}`);

        testResults.forEach(result => {
            const testName = result.field3;
            const testValue = result.field4;
            const unit = result.field5;
            Logger.log(`Resultado do teste ${testName}: ${testValue} ${unit}`);
        });

        const ackMessage = this.createACKResponse();
        this.sendMessage(ackMessage);
    }

    createACKResponse() {
        const MSH = {
            MSH: {
                field0: "MSH",
                field1: this.lastMessageReceived.MSH[0].field1,
                field2: this.lastMessageReceived.MSH[0].field3,
                field3: this.lastMessageReceived.MSH[0].field2,
                field4: this.lastMessageReceived.MSH[0].field5,
                field5: this.lastMessageReceived.MSH[0].field4,
                field6: getCurrentTimestamp(),
                field7: this.lastMessageReceived.MSH[0].field7,
                field8: "ACK^R01"
            }
        };

        const MSA = {
            MSA: {
                field0: "MSA",
                field1: "AA",
                field2: this.lastMessageReceived.MSH[0].field9,
                field3: "SUCCESS",
                field4: "",
                field5: "",
                field6: "0",
                field7: ""
            }
        };

        return [MSH, MSA];
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
                field6 : getCurrentTimestamp(),
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
                field6 : getCurrentTimestamp(),
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
                field6 : getCurrentTimestamp(),
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

    sendMessage(message) {
        const serializedMsg = serializeHL7MessageFromJSON(message);
         
        if (this.isConnected) {
            this.messageQueue.push(getControl('SB') + serializedMsg + getControl('EB') + getControl('CR'));
        } else {
            Logger.log('Dispositivo não está conectado', 'ERROR');
        }
    }

 
}

module.exports = HL7Protocol;
