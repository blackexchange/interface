// consume.js
const amqp = require('amqplib');

async function consumeMessage() {
    const url = 'amqp://user:password@localhost';
    const queue = 'minhaFila';

    try {
        const conn = await amqp.connect(url);
        const channel = await conn.createChannel();

        await channel.assertQueue(queue, {
            durable: true
        });

        console.log(`Esperando por mensagens em ${queue}. Para sair pressione CTRL+C`);

        // Consumir a mensagem da fila
        channel.consume(queue, message => {
            if (message !== null) {
                console.log(`Mensagem recebida: ${message.content.toString()}`);
                channel.ack(message);  // Confirmação de que a mensagem foi processada
            }
        });
    } catch (error) {
        console.error('Erro ao consumir mensagens:', error);
    }
}

consumeMessage();
