const db = require('./database');

class DBCon {
    
    static async getSampleOrders(sample, equipment) {
        try {
            // Executar a consulta usando o pool; não é necessário chamar db.connect() ou db.close()
            const results = await db.query(`SELECT * FROM ord WHERE ord_status="N" AND ord_sample="${sample}" AND ord_eqp="${equipment}"`);
            console.log('Obtendo folha da amostra ');
            return results;

        } catch (error) {
            console.error('Erro ao executar a consulta:', error);
        }
    }

    
    static async getEquipmentData(equipment) {
        try {
            // Executar a consulta usando o pool; não é necessário chamar db.connect() ou db.close()
            const results = await db.query('SELECT * FROM eqp WHERE eqp_alias="'+equipment+'"');
            console.log('Obtendo dados do equipamento...');
            return results;

        } catch (error) {
            console.error('Erro ao executar a consulta:', error);
        }
    }
}

module.exports = DBCon;