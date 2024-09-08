// src/services/queryService.js

const MultiDBManager = require('../database/MultiDBManager');

class QueryService {
    constructor(clientConfigs) {
        this.dbManager = new MultiDBManager(clientConfigs);
    }

    /**
     * Realiza uma consulta para um cliente específico e envia os resultados para um agente.
     * @param {string} clientId - ID do cliente.
     * @param {string} query - Consulta SQL a ser executada.
     * @param {object} agent - Agente que receberá os dados (deve ter um método `send`).
     */
    async sendQueryResultsToAgent(clientId, query, agent) {
        try {
            const results = await this.dbManager.queryClient(clientId, query);
            // Envia os resultados ao agente
            agent.send(results);
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
