// src/database/knex-sqlserver.js

const knexSqlServer = require('../../config/database');

class SqlServerDatabase {
    // Método para obter todos os registros de uma tabela
    static async getAll(tableName) {
        try {
            const result = await knexSqlServer.select('*').from(tableName);
            return result;
        } catch (error) {
            console.error(`Erro ao obter registros da tabela ${tableName}:`, error);
            throw error;
        }
    }

    // Método para obter um registro por ID
    static async getById(tableName, id) {
        try {
            const result = await knexSqlServer.select('*').from(tableName).where({ id });
            return result.length ? result[0] : null;
        } catch (error) {
            console.error(`Erro ao obter registro da tabela ${tableName} com ID ${id}:`, error);
            throw error;
        }
    }

    // Método para inserir um novo registro
    static async insert(tableName, data) {
        try {
            const [id] = await knexSqlServer(tableName).insert(data);
            return id;
        } catch (error) {
            console.error(`Erro ao inserir registro na tabela ${tableName}:`, error);
            throw error;
        }
    }

    // Método para atualizar um registro por ID
    static async updateById(tableName, id, data) {
        try {
            await knexSqlServer(tableName).where({ id }).update(data);
        } catch (error) {
            console.error(`Erro ao atualizar registro da tabela ${tableName} com ID ${id}:`, error);
            throw error;
        }
    }

    // Método para excluir um registro por ID
    static async deleteById(tableName, id) {
        try {
            await knexSqlServer(tableName).where({ id }).del();
        } catch (error) {
            console.error(`Erro ao excluir registro da tabela ${tableName} com ID ${id}:`, error);
            throw error;
        }
    }

    // Método para fechar a conexão com o banco
    static async closeConnection() {
        try {
            await knexSqlServer.destroy();
        } catch (error) {
            console.error('Erro ao fechar a conexão com o SQL Server:', error);
        }
    }
}

module.exports = SqlServerDatabase;
