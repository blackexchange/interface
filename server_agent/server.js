const { connectToDatabase } = require('./db');
const {manageConnections} = require('./connectionManager');
const { monitorNewInterfaces } = require('./changeStreamWatcher');

(async () => {
    try {
        console.log('system', 'Starting the agent app...');

        // Estabelece a conexão com o MongoDB
        await connectToDatabase();
        monitorNewInterfaces();

        // Após a conexão, inicia o monitoramento
        manageConnections();


    } catch (error) {
        console.error('system', `Failed to start the agent app: ${error.message}`);
        process.exit(1);
    }
})();
