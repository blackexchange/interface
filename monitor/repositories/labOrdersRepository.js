const {LabOrder} = require('../models/labOrderModel');
const { ObjectId } = require('mongodb');


const title = 'LabOrder';

function createOne(obj, session) {
    return LabOrder.insertMany(obj, { session });
}

function getAll() {
    return LabOrder.find().exec();
}

function deleteOne(id, session) {
    return LabOrder.findByIdAndDelete(id).session(session).exec();
}

function getByCondition(condition) {
    return LabOrder.find(condition).exec();
}


function getById(id) {
    return LabOrder.findById(id).exec();
}

async function updateOne(id, newObj) {
    try {
        // Encontrar o paciente pelo ID e atualizar com os novos dados
        const update = await Order.findOneAndUpdate(
            { _id: id }, // Filtro para encontrar o paciente pelo ID
            { $set: newObj }, // Atualizar os campos com os novos dados
            { new: true } // 'new: true' retorna o documento atualizado
        ).exec();

        if (!update) {
            // Se nenhum paciente foi encontrado, retornar uma mensagem de erro
            return {
                success: false,
                error: `${title} not found.`
            };
        }

        // Retornar um objeto indicando sucesso
        return {
            success: true,
            data: update
        };
    } catch (error) {
        // Retornar um objeto indicando erro
        return {
            success: false,
            error: error.message
        };
    }
}

async function updateStatus(orderIds) {
  try {
      // Encontrar o paciente pelo ID e atualizar com os novos dados
      const update = await LabOrder.updateMany(
        { "orders._id": { $in: orderIds } }, // Filtro: apenas os documentos com _id na lista
        { $set: { status: "QUEUE" } } // Atualização: define o novo status
      ).exec();

      if (!update) {
          // Se nenhum paciente foi encontrado, retornar uma mensagem de erro
          return {
              success: false,
              error: `${title} not found.`
          };
      }

      // Retornar um objeto indicando sucesso
      return {
          success: true,
          data: update
      };
  } catch (error) {
      // Retornar um objeto indicando erro
      return {
          success: false,
          error: error.message
      };
  }
}

async function getInterfaceData(dateFrom, dateUntil, userId, status) {
   // console.log(orders)

   const userObjId =  new  ObjectId(userId);
   
   const ret = await LabOrder.aggregate(
    [
      {
        $match: {
          status: status,
          createdBy: userObjId,
          createdAt: {
            $gt: new Date(
              dateFrom
            ),
            $lte: new Date(
              dateUntil
            )
          }
        }
      },
      { $unwind: '$orders' },
      { $unwind: '$orders.orderItens' },
      {
        $lookup: {
          from: 'interfaces',
          let: {
            examCode: '$orders.orderItens.examCode'
          },
          pipeline: [
            { $unwind: '$exams' },
            {
              $match: {
                $expr: {
                  $eq: ['$exams.code', '$$examCode']
                }
              }
            }
          ],
          as: 'matchingInterfaces'
        }
      },
      {
        $match: { matchingInterfaces: { $ne: [] } }
      },
      {
        $group: {
          _id: {
            examCode: "$orders.orderItens.examCode"
          },
          orders: {
            $addToSet: {
              orderId: "$orders._id",
              patient: "$orders.patient",
              item: "$orders.orderItens" // Adiciona cada orderInternal ao conjunto
            }
          },
          interfaces: {
            $first: "$matchingInterfaces"
          }
        }
      },
      {
        $group: {
          _id: "$interfaces._id",
          interfaceDetails: {
            $first: "$interfaces"
          },
          orders: {
            $first: "$orders"
          }
        }
      },
      {
        $project: {
          _id: 0,
          interfaces: "$interfaceDetails",
          orders: 1
        }
      }
    ],
    { maxTimeMS: 60000, allowDiskUse: true }
  ).exec();


  return ret;
        
 }
 
 
module.exports = {
    createOne,
    deleteOne,
    getAll,
    updateOne,
    getById,
    getByCondition,
    getInterfaceData,
    updateStatus
};
