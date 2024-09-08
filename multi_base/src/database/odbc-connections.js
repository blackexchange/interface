// src/database/odbc-connections.js

const odbc = require('odbc');
const { maxdbConfig } = require('../../config/db-config');

// Função para criar uma conexão ODBC com o MaxDB
async function createODBCConnection() {
    try {
        const connection = await odbc.connect(`DSN=${maxdbConfig.dsn}`);
        return connection;
    } catch (error) {
        throw new Error(`Erro ao conectar ao MaxDB via ODBC: ${error.message}`);
    }
}

module.exports = createODBCConnection;
