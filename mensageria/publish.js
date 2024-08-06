// publish.js
const amqp = require('amqplib');

async function publishMessage() {
    const url = 'amqp://user:password@localhost';
    const queue = 'minhaFila';
    const message = 'Hello, RabbitMQ!';

    try {
        const conn = await amqp.connect(url);
        const channel = await conn.createChannel();

        await channel.assertQueue(queue, {
            durable: true
        });

        // Enviar uma mensagem para a fila
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(`Mensagem enviada: ${message}`);

        // Fechar a conexão e o canal após um curto atraso
        setTimeout(() => {
            channel.close();
            conn.close();
        }, 500);
    } catch (error) {
        console.error('Erro ao publicar mensagem:', error);
    }
}

publishMessage();
