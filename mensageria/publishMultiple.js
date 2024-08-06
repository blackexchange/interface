const amqp = require('amqplib');

async function publishMessage() {
    const url = 'amqp://user:password@localhost';
    const exchangeName = 'topic_logs';

    try {
        const conn = await amqp.connect(url);
        const channel = await conn.createChannel();

        // Garantir que a exchange existe
        await channel.assertExchange(exchangeName, 'topic', { durable: false });

        // Mensagem de pedido
        const orderMessage = 'New order placed at 2024-08-04';
        const orderRoutingKey = 'order.created';

        // Mensagem de resultado
        const resultMessage = 'Order processed successfully';
        const resultRoutingKey = 'result.success';

        // Enviar mensagem de pedido
        channel.publish(exchangeName, orderRoutingKey, Buffer.from(orderMessage));
        console.log(`Pedido enviado: ${orderMessage}`);

        // Enviar mensagem de resultado
        channel.publish(exchangeName, resultRoutingKey, Buffer.from(resultMessage));
        console.log(`Resultado enviado: ${resultMessage}`);

        // Fechar a conexão após um curto atraso
        setTimeout(() => {
            channel.close();
            conn.close();
        }, 500);
    } catch (error) {
        console.error('Erro ao publicar mensagem:', error);
    }
}

publishMessage();
