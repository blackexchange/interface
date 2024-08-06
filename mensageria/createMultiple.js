const amqp = require('amqplib');

async function setup() {
    const url = 'amqp://user:password@localhost';
    const exchangeName = 'topic_logs';

    try {
        const conn = await amqp.connect(url);
        const channel = await conn.createChannel();

        // Criar uma exchange do tipo 'topic'
        await channel.assertExchange(exchangeName, 'topic', { durable: false });

        // Criar filas para 'orders' e 'results'
        const orderQueue = 'orderQueue';
        const resultQueue = 'resultQueue';

        await channel.assertQueue(orderQueue, { durable: false });
        await channel.assertQueue(resultQueue, { durable: false });

        // Vincular filas à exchange com chaves de roteamento específicas
        await channel.bindQueue(orderQueue, exchangeName, 'order.*');
        await channel.bindQueue(resultQueue, exchangeName, 'result.*');

        console.log(`Filas vinculadas à exchange '${exchangeName}' com padrões de roteamento específicos.`);

        // Fechar a conexão
        setTimeout(() => {
            channel.close();
            conn.close();
        }, 500);
    } catch (error) {
        console.error('Erro ao configurar a fila e exchange:', error);
    }
}

setup();
