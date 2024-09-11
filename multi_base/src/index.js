const QueryService = require('./services/queryService');
const machineUtils = require('./utils/machineUtils');
const moment = require('moment');
const cron = require('node-cron');

require('dotenv').config();

function getTimeWindow(hour) {
    const dataFim = moment().subtract(1, 'minute');
    const dataInicio = dataFim.clone().subtract(hour, 'hours');
    
    return { dataInicio: dataInicio.toISOString(), dataFim: dataFim.toISOString() };
}


async function getMachineId() {
    try {
        const uniqueId = await machineUtils.generateUniqueMachineId();
        return uniqueId;
    } catch (error) {
        console.error('Erro ao processar máquina:', error);
    }
}


(async () => {

    console.log ("Agente iniciado")

    const machineId = await getMachineId();

    const clientConfigs = {
        client1: {
            token: machineId,
            clientId: process.env.CLIENT_ID,
            dbType: process.env.DB_TYPE.toLocaleLowerCase(),
            user: process.env.SQLSERVER_USER,
            password: process.env.SQLSERVER_PASSWORD,
            server: process.env.SQLSERVER_HOST,
            database: process.env.SQLSERVER_DB
        }
    };

    const queryService = new QueryService(clientConfigs);

    let isRunning = false;

     // Exemplo de tarefa com intervalo de 5 minutos
     cron.schedule('*/1 * * * *', async () => {

        if (isRunning) {
            console.log('Tarefa ainda está em execução. Ignorando nova execução.');
            return;
        }
        isRunning = true;

        const { dataInicio, dataFim } = getTimeWindow(1);

        let params = {
            dtStart: dataInicio,
            dtEnd: dataFim,
            type: 'FAM'

        }

        try {
            console.log('Consultando FAM...');
        //    await queryService.sendQueryResultsToAgent('client1', `SELECT * FROM FAM WHERE FAM_DTHR >='${dataInicio}' AND FAM_DTHR < '${dataFim}' AND FAM_DESTINO='L'`, params);
            await queryService.sendQueryResultsToAgent('client1', `SELECT * FROM FAM WHERE FAM_DTHR >='2012-01-01' AND FAM_DTHR < '${dataFim}' AND FAM_DESTINO='L'`, params);
        
            params = {
                dtStart: dataInicio,
                dtEnd: dataFim,
                type: 'ORDERS'
    
            }

            console.log('Consultando Exames...');

        
            await queryService.sendQueryResultsToAgent('client1', 
                `select OSM_DTHR, SMM_OSM_SERIE, SMM_OSM, SMM_NUM smm_cod ,  PAC_NOME , PAC_REG PAC_SEXO , PAC_NASC , PAC_END
                    from smm , PAC , OSM
                    where OSM_DTHR >'2012-06-01' AND OSM_DTHR < '2020-06-02T18:36:00.909Z'
                    AND SMM.SMM_EXEC ='A'
                    AND smm_str ='123'
                    AND smm.SMM_OSM_SERIE = OSM_SERIE 
                    AND smm_osm = OSM_NUM 
                    AND OSM.OSM_PAC  = pac_reg`, params);

        } catch (error) {
            console.error('Erro ao consultar client1:', error);
        } finally {
            isRunning = false;

        }
    });

    // Fechar conexões com o banco quando necessário
    process.on('SIGINT', async () => {
        console.log('Fechando todas as conexões com o banco de dados');
        await queryService.shutdown();
        process.exit(0);
    });
})();