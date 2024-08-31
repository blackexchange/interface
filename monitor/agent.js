const { connectToDatabase } = require('./connections/db');
const Monitor = require('./monitor');

(async () => {
    try {
        console.log('system', 'Starting the agent app...');

        // Estabelece a conexão com o MongoDB
        await connectToDatabase();

        // Após a conexão, inicia o monitoramento
        Monitor.fetchDBEvents();

    } catch (error) {
        console.error('system', `Failed to start the agent app: ${error.message}`);
        process.exit(1);
    }
})();
