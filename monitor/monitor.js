const LabOrders = require('./repositories/labOrdersRepository');
const LabQueue = require('./repositories/labQueueRepository');

const { ObjectId } = require('mongodb');


require('dotenv').config();
const moment = require('moment');
moment.locale('pt-br');

const userId = process.env.USER_MONITOR; 
const minutsBefore = parseInt(process.env.MINUTES_BEFORE) || 2;
const hoursBefore =  parseInt(process.env.HOURS_BEFORE) || 24;

class Monitor {

    // Função para consultar registros dos últimos minutos, executando a cada minuto
    static async fetchDBEvents() {
        const now = moment();

        // Subtraindo 2 minutos da hora atual para definir 'dateUntil'
        const dateUntil = moment(now).subtract(minutsBefore, 'minutes').format('YYYY-MM-DD HH:mm:ss');

        // Subtraindo 1 dia da data que está em 'dateUntil' para definir 'dateFrom'
        const dateFrom = moment(dateUntil).subtract(hoursBefore, 'hours').format('YYYY-MM-DD HH:mm:ss');
        try{
            const ret = await LabOrders.getInterfaceData(dateFrom, dateUntil, userId, 'PENDENT');


            if (ret){
              //  const orderIds = JSON.parse (ret).orders.map(order => order.orderId.$oid);

                //console.log(orderIds);

                const labRet = await LabQueue.createOne(ret);

                const orderIds = [
                    ...new Set(labRet.flatMap(doc => 
                      doc.orders.map(order => new ObjectId(order.orderId).toString())
                    ))
                  ].map(id => new ObjectId(id));

                console.log(orderIds)

                const update = await LabOrders.updateStatus(orderIds);
              //  console.log(update)

            }

        } catch (err) {
            console.log(err.message);
        }

    }
    // Torna o método estático para ser acessado pela classe
    static async sendToInterface(data) {

        const order = await labOrders.findById(orderId).populate('patient');
        if (!order) {
            throw new Error('Order not found');
        }

        const ret = await labOrders.createOne(data);
        console.log(`Inserted: ${ret}`);
    }

    static async insertObservations(data) {
        const ret = await labOrders.getInterfaceData(data);
       // console.log(`Inserted: ${ret}`);
    }

    static async updateRecord(ids) {
        const query = `UPDATE ord SET ord_status = 'F' , ord_updated_at=NOW() WHERE ord_id IN (?)`;
        await db.query(query, [ids]);
    }
}

module.exports = Monitor;
