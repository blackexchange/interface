// Importar a biblioteca amqplib
const amqp = require('amqplib');

async function publishMessage() {
    const amqpUrl = 'amqp://admin:12345@localhost/lab_vhost'; // URL de conexão incluindo o vhost

    try {
        // Conectar ao servidor RabbitMQ
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();

        const queue = 'orders';  // Nome da fila
        const message = 'Hello, RabbitMQ!';  // Mensagem a ser enviada

        // Garantir que a fila existe antes de tentar publicar
        await channel.assertQueue(queue, {
            durable: true  // Fila persistente
        });

        // Enviar uma mensagem para a fila
        channel.sendToQueue(queue, Buffer.from(message));
        console.log("Mensagem enviada:", message);

        // Fechar a conexão e sair
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error("Erro ao publicar mensagem:", error);
        process.exit(1);
    }
}

// Executar a função de publicar mensagem
publishMessage();
