// consumeOrders.js
const amqp = require('amqplib');

async function consumeOrders() {
    const url = 'amqp://user:password@localhost';
    const orderQueue = 'orderQueue';

    try {
        const conn = await amqp.connect(url);
        const channel = await conn.createChannel();

        console.log(`Esperando por mensagens em '${orderQueue}'. Para sair pressione CTRL+C`);

        channel.consume(orderQueue, message => {
            if (message !== null) {
                console.log(`Pedido recebido: ${message.content.toString()}`);
                channel.ack(message);
            }
        });
    } catch (error) {
        console.error('Erro ao consumir mensagens:', error);
    }
}

consumeOrders();
