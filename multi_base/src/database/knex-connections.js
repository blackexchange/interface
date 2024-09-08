// src/database/knex-connections.js

const knex = require('knex');
const { knexConfigs } = require('../../config/db-config');

// Função para criar uma conexão Knex.js com base no tipo de banco de dados
function createKnexConnection(dbType) {
    const config = knexConfigs[dbType];
    if (!config) {
        throw new Error(`Configuração para o banco de dados ${dbType} não encontrada.`);
    }
    return knex(config);
}

module.exports = createKnexConnection;
