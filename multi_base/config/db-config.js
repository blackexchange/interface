// config/db-config.js

require('dotenv').config();
const knex = require('knex');
const { Sequelize } = require('sequelize');
const odbc = require('odbc');

// Configurações para diferentes bancos de dados usando Knex.js
const knexConfigs = {
    oracle: {
        client: 'oracledb',
        connection: {
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONNECTION_STRING,
        },
        pool: { min: 2, max: 10 },
        acquireConnectionTimeout: 10000,
    },
    sqlserver: {
        client: 'mssql',
        connection: {
            user: process.env.SQLSERVER_USER,
            password: process.env.SQLSERVER_PASSWORD,
            server: process.env.SQLSERVER_HOST,
            database: process.env.SQLSERVER_DB,
            options: {
                encrypt: true,
                enableArithAbort: true,
            },
        },
        pool: { min: 2, max: 10 },
        acquireConnectionTimeout: 10000,
    },
};

// Configurações para diferentes bancos de dados usando Sequelize
const sequelizeConfigs = {
    mysql: {
        dialect: 'mysql',
        host: process.env.MYSQL_HOST,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
        dialectOptions: {
            encrypt: true, // Se necessário
        },
        pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000,
        },
    },
    postgres: {
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        dialectOptions: {
            encrypt: true, // Se necessário
        },
        pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000,
        },
    },
};

// Configuração para MaxDB via ODBC
const maxdbConfig = {
    dsn: process.env.MAXDB_DSN,
};

module.exports = {
    knexConfigs,
    sequelizeConfigs,
    maxdbConfig,
};
