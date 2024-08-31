// consumeOrders.js
const amqp = require('amqplib');

class ConsumeOrders {

 static async consumeOrders() {
    const url = 'amqp://admin:12345@localhost/lab_vhost';
    const orderQueue = 'orders';

    try {
        const conn = await amqp.connect(url);
        const channel = await conn.createChannel();

        console.log(`Esperando por mensagens em '${orderQueue}'. Para sair pressione CTRL+C`);

        channel.consume(orderQueue, message => {
            if (message !== null) {

                const order = JSON.parse(message.content.toString());
                console.log(`Pedido recebido: ${order.ord_eqp}`);
                channel.ack(message);
            }
        });
    } catch (error) {
        console.error('Erro ao consumir mensagens:', error);
    }
}
}
module.exports = ConsumeOrders;

