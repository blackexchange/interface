// database.js
const mysql = require('mysql2');

require('dotenv').config();

class Database {
    constructor() {
        // Cria um pool de conexões ao invés de uma única conexão
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    // A função connect não é necessária para um pool, pois as conexões são gerenciadas automaticamente
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, args, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    // O método close deve agora fechar todo o pool ao invés de uma única conexão
    close() {
        return new Promise((resolve, reject) => {
            this.pool.end(err => {
                if (err) {
                    return reject(err);
                }
                console.log('Todas as conexões no pool foram encerradas');
                resolve();
            });
        });
    }
}

module.exports = new Database();
