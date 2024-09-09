const QueryService = require('./services/queryService');
const machineUtils = require('./utils/machineUtils');

require('dotenv').config();

async function getMachineId() {
    try {
        const uniqueId = await machineUtils.generateUniqueMachineId();
        
        // Agora você pode usar `uniqueId` como quiser.
        return uniqueId;
    } catch (error) {
        console.error('Erro ao processar máquina:', error);
    }
}


(async () => {
    const machineId = await getMachineId();

    // Configurações de clientes (normalmente armazenado em um banco de dados central ou arquivo de configuração)
    const clientConfigs = {
     
        client1: {
            token:machineId,
            clientId: process.env.CLIENT_ID,
            dbType: process.env.DB_TYPE.toLocaleLowerCase(),
            user: process.env.SQLSERVER_USER,
            password: process.env.SQLSERVER_PASSWORD,
            server: process.env.SQLSERVER_HOST,
            database: process.env.SQLSERVER_DB
        }
    };
    const queryService = new QueryService(clientConfigs);


    try {
        // Realiza uma consulta no cliente 1 (Oracle) e envia para o agente
        await queryService.sendQueryResultsToAgent('client1', "SELECT *  FROM FAM WHERE FAM_COD_AMOSTRA='109000167220'");

        /*
        // Realiza uma consulta no cliente 2 (MaxDB) e envia para o agente
        await queryService.sendQueryResultsToAgent('client2', 'SELECT * FROM devices', agent);

        // Realiza uma consulta no cliente 3 (SQL Server) e envia para o agente
        await queryService.sendQueryResultsToAgent('client3', 'SELECT * FROM orders', agent);

        // Realiza uma consulta no cliente 4 (MySQL) e envia para o agente
        await queryService.sendQueryResultsToAgent('client4', 'SELECT * FROM products', agent);

        // Realiza uma consulta no cliente 5 (PostgreSQL) e envia para o agente
        await queryService.sendQueryResultsToAgent('client5', 'SELECT * FROM sales', agent);
        */
    } catch (error) {
        console.error('Erro geral:', error);
    } finally {
        // Fecha todas as conexões com os bancos de dados
        await queryService.shutdown();
    }
})();
