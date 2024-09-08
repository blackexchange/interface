// src/database/sequelize-connections.js

const { Sequelize } = require('sequelize');
const { sequelizeConfigs } = require('../../config/db-config');

// Função para criar uma conexão Sequelize com base no tipo de banco de dados
function createSequelizeConnection(dbType) {
    const config = sequelizeConfigs[dbType];
    if (!config) {
        throw new Error(`Configuração para o banco de dados ${dbType} não encontrada.`);
    }
    const sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: config.dialect,
        dialectOptions: config.dialectOptions,
        pool: config.pool,
    });
    return sequelize;
}

module.exports = createSequelizeConnection;
