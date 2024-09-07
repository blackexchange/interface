const { connectToDatabase } = require('./services/db');
const {manageConnections} = require('./services/connectionManager');
const { monitorNewInterfaces } = require('./services/changeStreamWatcher');

(async () => {
    try {
        console.log('system', 'Starting the agent manager...');

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
