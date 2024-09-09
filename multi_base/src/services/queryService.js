
const MultiDBManager = require('../database/MultiDBManager');
const {sendData} = require("./agentService");

class QueryService {
    constructor(clientConfigs) {
        this.clientConfigs = clientConfigs;
        this.dbManager = new MultiDBManager(clientConfigs);
    }

    /**
     * Realiza uma consulta para um cliente específico e envia os resultados para um agente.
     * @param {string} clientId - ID do cliente.
     * @param {string} query - Consulta SQL a ser executada.
     */
    async sendQueryResultsToAgent(clientId, query) {
        try {
            const results = await this.dbManager.queryClient(clientId, query);
            // Envia os resultados ao agente
            sendData(results, this.clientConfigs[clientId]);
        } catch (error) {
            console.error(`Erro ao enviar resultados para o agente para o cliente ${clientId}:`, error);
        }
    }

    /**
     * Fecha todas as conexões com os bancos de dados.
     */
    async shutdown() {
        await this.dbManager.closeAllConnections();
    }
}

module.exports = QueryService;
