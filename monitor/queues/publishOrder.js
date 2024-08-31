const amqp = require('amqplib');



async function connectRabbitMQ() {
    const connection = await amqp.connect( 'amqp://admin:12345@localhost/lab_vhost');
    const channel = await connection.createConfirmChannel();
    await channel.confirmSelect ;
    return { connection, channel };
}

async function sendRecords(records, queueName) {
    const { connection, channel } = await connectRabbitMQ();

    await channel.assertQueue(queueName, { durable: true });
    let sentRecords = [];

    // Mapeia cada record para uma promessa de envio e tratamento de status
    const sendPromises = records.map((record) => {
        return new Promise(async (resolve, reject) => {
            
            const content = Buffer.from(JSON.stringify(record));

            channel.sendToQueue(queueName, content, {}, (err) => {
                if (err) {
                    console.error('Message send failed', err);
                    reject(err);
                } else {
                    //console.log('Message sent', record);
                    updateRecordStatus(record, 'enviado').then(() => {
                        sentRecords.push(record.ord_id); // Adiciona o registro ao array de sucesso
                        resolve();
                    }).catch(reject);
                }
            });
        });
    });

    // Aguarda todas as promessas de envio
    try {
        await Promise.all(sendPromises);
        await channel.waitForConfirms(); // Aguarda confirmações do RabbitMQ

        
    } catch (error) {
        console.error('Error during message sending or status updating:', error);
    } finally {
        await channel.close();
        await connection.close();
    }

    if (records.length > 0) {
       // await updateRecordStatus(records, 'F');
    }

    return sentRecords; // R
}

async function updateRecordStatus(recordId, status) {
    // Implementar lógica para atualizar o status no banco de dados
    console.log(`Status do registro ID ${recordId.ord_id} atualizado para ${status}`);
}

class PublishOrder {

    static async publishMessage(message, queue) {
        
        //const stringMsg = JSON.stringify(message);

        //([message], queue);

        try {
            const sentRecords = await sendRecords(message, queue);
            //console.log('Registros enviados com sucesso:', sentRecords);
            return sentRecords;
        } catch (error) {
            console.error('Erro ao processar ou enviar dados:', error);
        }
        /*
       
        try {
            // Conectar ao servidor RabbitMQ
            const connection = await amqp.connect(amqpUrl);
            const channel = await connection.createChannel();
    
            // Garantir que a fila existe antes de tentar publicar
            await channel.assertQueue(queue, {
                durable: true  // Fila persistente
            });

            const total = message.length;

            const stringMsg = JSON.stringify(message);
    
            // Enviar uma mensagem para a fila
            channel.sendToQueue(queue, Buffer.from(stringMsg));
            console.log("Mensagem enviadas! " + parseInt(total).toString());
    
            // Fechar a conexão após um curto atraso
            setTimeout(() => {
                connection.close();
            }, 500);
        } catch (error) {
            console.error("Erro ao publicar mensagem:", error);
            throw error;  // Lançar erro para ser tratado por quem chama
        }
            */
    }
}

module.exports = PublishOrder;
