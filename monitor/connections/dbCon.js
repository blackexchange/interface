const db = require('./database');
const pOrders = require('../queues/publishOrder');
const moment = require('moment'); // Primeiro, instale o moment com `npm install moment`
moment.locale('pt-br');


class DBCon {
    //agora  20:02
    // exames = 2 minutos atras = 20:00
    // de  =

    //Função para consultar registros dos últimos 5 minutos, executando a cada minuto
    static async fetchDBEvents() {
          
      const now = moment();

      // Subtraindo 2 minutos da hora atual para definir 'dateUntil'
      const dateUntil = moment(now).subtract(2, 'minutes').format('YYYY-MM-DD HH:mm:ss');

      // Subtraindo 1 dia da data que está em 'dateUntil' para definir 'dateFrom'
      const dateFrom = moment(dateUntil).subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss');

      const query = `
          SELECT * FROM ord
            WHERE ord_created_at >= ? 
            AND ord_created_at < ? 
            AND (ord_status = 'P' OR ISNULL(ord_status)) 
            ORDER BY ord_created_at ASC;
        `;

        try {

          const results = await db.query(query, [dateFrom, dateUntil]);
        // const [results] = await db.query(query);

          // Assumindo que pOrders.publishMessage é uma função assíncrona adequada
      
          if (results.length > 0){
            //console.log('Eventos recuperados:', results);
          
            var ret =  await pOrders.publishMessage(results,'orders');
            if (ret){
              DBCon.updateRecord(ret);
            }
          }


          } catch (error) {
              console.error('Erro ao buscar eventos:', error.message);
        }
      }

      static async updateRecord(ids){

        const query = `UPDATE ord SET ord_status = 'F' , ord_updated_at=NOW() WHERE ord_id IN (?)`;
        await db.query(query, [ids]);
        //console.log(`Status of records updated to F for IDs: ${ids}`);

      }
}
module.exports = DBCon;
