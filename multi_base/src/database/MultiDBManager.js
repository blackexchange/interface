// src/database/MultiDBManager.js

const createKnexConnection = require('./knex-connections');
const createSequelizeConnection = require('./sequelize-connections');

class MultiDBManager {
    constructor(clientConfigs) {
        this.clientConfigs = clientConfigs; // Configurações de cada cliente
        this.connections = {}; // Armazena conexões ativas
    }

    // Método para obter uma conexão baseada no tipo de banco de dados
    async getConnection(clientId) {
        const clientConfig = this.clientConfigs[clientId];
        if (!clientConfig) {
            throw new Error(`Configuração para o cliente com ID ${clientId} não encontrada.`);
        }

        const dbType = clientConfig.dbType;

        if (this.connections[clientId]) {
            return this.connections[clientId];
        }

        let connection;

        switch (dbType) {
            case 'oracle':
            case 'sqlserver':
                connection = createSequelizeConnection(dbType);
                break;
            case 'mysql':
            case 'postgres':
                connection = createSequelizeConnection(dbType);
                await connection.authenticate();
                break;
          
            default:
                throw new Error(`Tipo de banco de dados ${dbType} não suportado.`);
        }

        this.connections[clientId] = connection;
        return connection;
    }

    // Método para realizar uma consulta em um cliente específico
    async queryClient(clientId, query) {
        const clientConfig = this.clientConfigs[clientId];
        if (!clientConfig) {
            throw new Error(`Cliente com ID ${clientId} não encontrado.`);
        }

        const dbType = clientConfig.dbType;
        const connection = await this.getConnection(clientId);

        try {
            if (dbType === 'oracle') { // Knex.js
                const result = await connection.raw(query);
                return result;
            } else if (dbType === 'mysql' || dbType === 'postgres' || dbType === 'sqlserver') { // Sequelize
                const [results, metadata] = await connection.query(query);
                return results;
            } else if (dbType === 'maxdb') { // ODBC
                const result = await connection.query(query);
                return result;
            } else {
                throw new Error(`Tipo de banco de dados ${dbType} não suportado para consultas.`);
            }
        } catch (error) {
            console.error(`Erro ao consultar o cliente ${clientId}:`, error);
            throw error;
        }
    }

    // Método para fechar todas as conexões
    async closeAllConnections() {
        for (const clientId in this.connections) {
            const clientConfig = this.clientConfigs[clientId];
            const dbType = clientConfig.dbType;
            const connection = this.connections[clientId];

            try {
                if (dbType === 'oracle' ) { // Knex.js
                    await connection.destroy();
                } else if (dbType === 'mysql' || dbType === 'postgres'|| dbType === 'sqlserver') { // Sequelize
                    await connection.close();
                } else if (dbType === 'maxdb') { // ODBC
                    await connection.close();
                }
            } catch (error) {
                console.error(`Erro ao fechar a conexão com o cliente ${clientId}:`, error);
            }
        }
    }
}

module.exports = MultiDBManager;
