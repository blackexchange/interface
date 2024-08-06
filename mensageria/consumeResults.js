// consumeResults.js
const amqp = require('amqplib');

async function consumeResults() {
    const url = 'amqp://user:password@localhost';
    const resultQueue = 'resultQueue';

    try {
        const conn = await amqp.connect(url);
        const channel = await conn.createChannel();

        console.log(`Esperando por mensagens em '${resultQueue}'. Para sair pressione CTRL+C`);

        channel.consume(resultQueue, message => {
            if (message !== null) {
                console.log(`Resultado recebido: ${message.content.toString()}`);
                channel.ack(message);
            }
        });
    } catch (error) {
        console.error('Erro ao consumir mensagens:', error);
    }
}

consumeResults();
