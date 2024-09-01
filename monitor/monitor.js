const ordersRepository = require('./repositories/ordersRepository');
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

        try {
            const orders = await ordersRepository.getByCondition({
                status: 'PENDENT',
                createdBy: new ObjectId(userId),
                createdAt: {
                    $gt: new Date(dateFrom), // Maior que esta data
                    $lte: new Date(dateUntil) // Menor ou igual a esta data
                }
            });

            if (orders.length > 0) {
                // Chama o método estático corretamente
                await Monitor.insertObservations(orders);
            } else {
                console.log('NAO exame ', dateFrom, dateUntil);
            }

        } catch (err) {
            console.log(err.message);
        }
    }

    // Torna o método estático para ser acessado pela classe
    static async sendToInterface(data) {

        const order = await Order.findById(orderId).populate('patient');
        if (!order) {
            throw new Error('Order not found');
        }

        const ret = await ordersRepository.createOne(data);
        console.log(`Inserted: ${ret}`);
    }

    static async insertObservations(data) {
        const ret = await ordersRepository.getInterfaceData(data);
       // console.log(`Inserted: ${ret}`);
    }

    static async updateRecord(ids) {
        const query = `UPDATE ord SET ord_status = 'F' , ord_updated_at=NOW() WHERE ord_id IN (?)`;
        await db.query(query, [ids]);
    }
}

module.exports = Monitor;
