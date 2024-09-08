// src/index.js

const QueryService = require('./services/queryService');

(async () => {
    // Configurações de clientes (normalmente armazenado em um banco de dados central ou arquivo de configuração)
    const clientConfigs = {
        client1: {
            dbType: 'oracle',
            user: 'oracle_user',
            password: 'oracle_password',
            connectString: 'localhost:1521/xe',
        },
        client2: {
            dbType: 'maxdb',
            DSN: 'MaxDB_DSN',
        },
        client3: {
            dbType: 'sqlserver',
            user: 'sqlserver_user',
            password: 'sqlserver_password',
            server: 'localhost',
            database: 'cliente_db',
        },
        client4: {
            dbType: 'mysql',
            host: 'localhost',
            user: 'mysql_user',
            password: 'mysql_password',
            database: 'cliente_mysql',
        },
        client5: {
            dbType: 'postgres',
            host: 'localhost',
            user: 'postgres_user',
            password: 'postgres_password',
            database: 'cliente_postgres',
        },
        // Outros clientes...
    };

    const queryService = new QueryService(clientConfigs);

    // Exemplo de agente (um sistema que vai receber os resultados)
    const agent = {
        send: (data) => {
            console.log('Enviando dados para o agente:', data);
        },
    };

    try {
        // Realiza uma consulta no cliente 1 (Oracle) e envia para o agente
        await queryService.sendQueryResultsToAgent('client1', 'SELECT * FROM users', agent);

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
