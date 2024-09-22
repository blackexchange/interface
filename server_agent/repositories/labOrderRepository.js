const {LabOrder} = require('../models/labOrderModel');

const title = 'LabOrder';



function getById(id) {
    return LabOrder.findById(id).exec();
}

async function getOrdersByBarcode(codBar) {
    try {
      const result = await LabOrder.aggregate([
        // Desestrutura os documentos para acessar orders e orderItens
        { $unwind: '$orders' },
        { $unwind: '$orders.orderItens' },
  
        // Filtra o item que contém o código de barras especificado e onde o status não existe
        {
          $match: {
            'orders.orderItens.codBar': codBar,
            'orders.orderItens.status': { $exists: false }
          }
        },
  
        // Reestrutura os dados da ordem para incluir apenas os itens que contêm o código de barras
        {
          $group: {
            _id: '$_id', // Mantém o ID original da ordem
            orderId: { $first: '$orders.orderId' },
            patient: { $first: '$orders.patient' },
            createdAt: { $first: '$createdAt' },
            createdBy: { $first: '$createdBy' },
            status: { $first: '$status' },
            updatedAt: { $first: '$updatedAt' },
            orderItens: {
              $push: {
                itemId: '$orders.orderItens.itemId',
                examCode: '$orders.orderItens.examCode',
                codBar: '$orders.orderItens.codBar',
                material: '$orders.orderItens.material'
              }
            }
          }
        },
  
        // Projeta os resultados da ordem com os dados completos e os itens correspondentes
        {
          $project: {
            _id: 1,
            orderId: 1,
            patient: 1,
            createdAt: 1,
            createdBy: 1,
            status: 1,
            updatedAt: 1,
            orderItens: 1
          }
        }
      ]).exec();

     
      return result;
  
    } catch (error) {
      console.error('Error finding orders:', error);
    }
  }
  


 
module.exports = {
   
    getById,
    getOrdersByBarcode
};
