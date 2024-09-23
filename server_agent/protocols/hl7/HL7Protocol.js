const TCPBase = require('../TCPBase'); // Classe base de comunicação TCP
const { parseHL7MessageToJSON, serializeHL7MessageFromJSON, getCurrentTimestamp,getControl } = require('../../utils/helper');
const Logger = require('../../utils/Logger');

class HL7Protocol extends TCPBase {
    constructor(device) {
        super(device); // Chama o construtor da classe base
    }
    

    // Sobrescreve o método para processar as mensagens recebidas
    receiveMessage(data) {
        try {
            // Acumula o buffer de dados recebidos (supondo que o buffer seja uma propriedade da classe)
            this.buffer = this.buffer ? Buffer.concat([this.buffer, data]) : data;
    
            let startIdx = this.buffer.indexOf(0x0B); // Delimitador SB (Start Block)
            let endIdx = this.buffer.indexOf(0x1C, startIdx); // Delimitador EB (End Block)
    
            // Processa todas as mensagens completas no buffer
            while (startIdx !== -1 && endIdx !== -1) {
                // Verifica o fim da mensagem (0x1C seguido de 0x0D)
                if (this.buffer[endIdx + 1] === 0x0D) {
                    // Extrai a mensagem completa do buffer
                    const messageBuffer = this.buffer.slice(startIdx, endIdx + 2); // Inclui 0x0D
    
                    // Remove a mensagem processada do buffer
                    this.buffer = this.buffer.slice(endIdx + 2);
    
                    // Processa a mensagem HL7
                    this.processMessage(messageBuffer);
                } else {
                    break; // Aguarda mais dados se 0x0D não for encontrado após 0x1C
                }
    
                // Procura a próxima mensagem
                startIdx = this.buffer.indexOf(0x0B); 
                endIdx = this.buffer.indexOf(0x1C, startIdx);
            }
        } catch (err) {
            Logger.log(`Erro ao processar recebimento de mensagem HL7: ${err.message}`, 'ERROR');
        }
    }

    processMessage(messageBuffer) {
        try {
            const trimmedBuffer = messageBuffer.subarray(1, messageBuffer.length - 2);
            const rawMessage = trimmedBuffer.toString('utf8').replace(/\n/g, '');
    
            // Converte a mensagem HL7 para JSON
            const parsedMessage = parseHL7MessageToJSON(rawMessage);
            this.lastMessageReceived = parsedMessage;
    
            const messageType = parsedMessage?.MSH?.[0]?.field8 || '';
    
            switch (messageType) {
                case 'ORU^R01':
                    this.processORU_R01(parsedMessage);
                    break;
                case 'QRY^Q02':
                    this.processQRY_Q02(parsedMessage);
                    break;
                case 'ACK^Q03':
                    this.processACK_Q03(parsedMessage);
                    break;
                default:
                    Logger.log(`Tipo de mensagem não reconhecido: ${messageType}`, 'ERROR');
            }
        } catch (err) {
            Logger.log(`Erro ao processar a mensagem HL7: ${err.message}`, 'ERROR');
        }
    }

    getField(segment, fieldMapping) {
        return segment?.[`field${fieldMapping}`] || ''; // Acessa o campo com base no índice, como "field5"
    }

    async processORU_R01(message) {
        
        // Extração direta dos campos de PID para evitar repetição
        const patientPID = message?.PID?.[0] || {};
        
        // Otimização com uso de map() em vez de forEach
        const testResults = message?.OBX?.map(result => ({
            test: this.getField(result,this.field.test),
            value:this.getField( result,this.field.value),
            unit: this.getField(result,this.field.unit),
            flags:this.getField( result,this.field.flags),
        })) || [];
    
        // Criação dos dados finais
        const data = {
            patient: {
                name: this.getField(patientPID, this.field.patientName),
                sex:  this.getField(patientPID,this.field.sex) , // Corrigindo o campo de sexo para field8
                dateOfBirth: this.getField(patientPID, this.field.dateOfBirth ), // Corrigindo o campo de data de nascimento para field7
            },
            device: this.device,
            barCode: this.getField(message?.OBR?.[0],this.field.barCode), // Código de barras da amostra
            sampleType:  this.getField(message?.OBR?.[0],this.field.sampleType),  // Amostra
            results: testResults,
        };
        const ackMessage = this.createResultResponse();
        this.sendMessage(ackMessage);    
        // Inserção assíncrona de resultados
        await this.insertResult(data);
    
        // Envia mensagem de ACK

    }

    async processQRY_Q02(message) {
        
        // Extração direta dos campos de PID para evitar repetição
        const barCode = message?.QRD?.[0].field8 || {};
        
        const orders = await this.getTestOrders(barCode);

        if (orders.length > 0){
            const ack = this.createQueryResponse(true);
            this.sendMessage(ack); 

          const requestMsg = this.createDSRResponse(orders,message);
           this.sendMessage(requestMsg); 

            this.lastSentMessage = requestMsg;
            this.sendNextMessage();

        }else{
            
            const response = this.createQueryResponse(true);
            this.sendMessage(response); 
            this.sendNextMessage();

        }
  

    }

    async processACK_Q03(message) {
        
        // Extração direta dos campos de PID para evitar repetição
        const barCode = message?.QRD?.[0].field8 || {};
        console.log("ACK Q03 Recebido")
        
        //const orders = await this.getTestOrders(barCode);
  

    }
    
    /*

    createACKResponse(message) {
        const MSH = {
            MSH: {
                field0: "MSH",
                field1: message.MSH[0].field1,
                field2: message.MSH[0].field3,
                field3: message.MSH[0].field2,
                field4: message.MSH[0].field5,
                field5: message.MSH[0].field4,
                field6: getCurrentTimestamp(),
                field7: message.MSH[0].field7,
                field8: "ACK^R01",
                field9: message.MSH[0].field9,
                field10: message.MSH[0].field10,
                field11: message.MSH[0].field11,
                field12: message.MSH[0].field12,
                field13: message.MSH[0].field13,
                field14: message.MSH[0].field14,
                field15: message.MSH[0].field15,
                field16: message.MSH[0].field16,
                field17: message.MSH[0].field17,
                field18: message.MSH[0].field18,
                field19: message.MSH[0].field19,
                field20: message.MSH[0].field20,

            }
        };

        const MSA = {
            MSA: {
                field0: "MSA",
                field1: "AA",
                field2: message.MSH[0].field9,
                field3: "SUCCESS",
                field4: "",
                field5: "",
                field6: "0",
                field7: ""
            }
        };

        return [MSH, MSA];
    }
    */


    processDSR_Q03(worklist, message) {


        const dsrResponse = this.createDSRResponse(worklist,message); // Pega o ID da mensagem original para incluir no ACK
        //this.sendMessage(dsrResponse);
        

    }

  

    createQueryResponse(noexam = false) {
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
                  field8 : "QCK^Q02",
                  field9: this.lastMessageReceived.MSH[0].field9,
                  field10: this.lastMessageReceived.MSH[0].field10,
                  field11: this.lastMessageReceived.MSH[0].field11,
                  field12: this.lastMessageReceived.MSH[0].field12,
                  field13: this.lastMessageReceived.MSH[0].field13,
                  field14: this.lastMessageReceived.MSH[0].field14,
                  field15: this.lastMessageReceived.MSH[0].field15,
                  field16: this.lastMessageReceived.MSH[0].field16,
                  field17: this.lastMessageReceived.MSH[0].field17,
                  field18: this.lastMessageReceived.MSH[0].field18,
                  field19: this.lastMessageReceived.MSH[0].field19,
                  field20: this.lastMessageReceived.MSH[0].field20
              }
              
          };            
  
  
          let MSA = { "MSA":{
              field0:"MSA",
              field1:"AA",
              field2: this.lastMessageReceived.MSH[0].field9,
              field3:"Query received",
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
              field1:'SR',
              field2: `${noexam ? "NF":"OK"}`,
              field3:""}
          }
  
          const ackMessage =[MSH,MSA,ERR,QAK];
          return ackMessage;
      }
  

    createResultResponse() {
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
                field8 : "ACK^R01",
                field9: this.lastMessageReceived.MSH[0].field9,
                field10: this.lastMessageReceived.MSH[0].field10,
                field11: this.lastMessageReceived.MSH[0].field11,
                field12: this.lastMessageReceived.MSH[0].field12,
                field13: this.lastMessageReceived.MSH[0].field13,
                field14: this.lastMessageReceived.MSH[0].field14,
                field15: this.lastMessageReceived.MSH[0].field15,
                field16: this.lastMessageReceived.MSH[0].field16,
                field17: this.lastMessageReceived.MSH[0].field17,
                field18: this.lastMessageReceived.MSH[0].field18,
                field19: this.lastMessageReceived.MSH[0].field19,
                field20: this.lastMessageReceived.MSH[0].field20
            }
            
        };            


        let MSA = { "MSA":{
            field0:"MSA",
            field1:"AA",
            field2: this.lastMessageReceived.MSH[0].field9,
            field3:"Result received",
            field4:"",
            field5:"",
            field6:"0",
            field7:""}
        }
        

        const ackMessage =[MSH,MSA];
        return ackMessage;
    }


    createDSRResponse(worklist,message) {

        const totalExam = worklist[0].orderItens.length; 
        const examList = worklist[0].orderItens.map((exam, index) => {
            return {DSP:{
                    field0: "DSP",
                    field1: (29 + index).toString(), // Incrementa a partir de 29
                    field2: "",
                    field3: "",
                    field4: exam.examCode + "^^^", // Insere o nome do exame no field4
                    field5: ""
            }};
        });

        const MSH = {
            MSH:{
                field0 : "MSH",
                field1 : message.MSH[0].field1,
                field2 : message.MSH[0].field3,
                field3 : message.MSH[0].field2,
                field4 : message.MSH[0].field5,
                field5 : message.MSH[0].field4,
                field6 : getCurrentTimestamp(),
                field7 : message.MSH[0].field7,
                field8 : "DSR^Q03",
                field9: this.lastMessageReceived.MSH[0].field9,
                field10: this.lastMessageReceived.MSH[0].field10,
                field11: this.lastMessageReceived.MSH[0].field11,
                field12: this.lastMessageReceived.MSH[0].field12,
                field13: this.lastMessageReceived.MSH[0].field13,
                field14: this.lastMessageReceived.MSH[0].field14,
                field15: this.lastMessageReceived.MSH[0].field15,
                field16: this.lastMessageReceived.MSH[0].field16,
                field17: this.lastMessageReceived.MSH[0].field17,
                field18: this.lastMessageReceived.MSH[0].field18,
                field19: this.lastMessageReceived.MSH[0].field19,
                field20: this.lastMessageReceived.MSH[0].field20
            }
            
        };   

        const QRD = {
            QRD:message.QRD[0]
        };  

        const QRF = {
            QRF:message.QRF[0]
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
