const {Interface} = require('../models/interfaceModel');

const title = 'Interface';

function getActiveDevices() {
    return Interface.find({ 'devices.status': 'active' }).exec();
}


function getByCondition(condition) {
    return Interface.find(condition).exec();
}

function getById(id) {
    return Interface.findById(id).exec();
}

async function setDeviceOnline(id, status) {
    try {
        // Encontrar o paciente pelo ID e atualizar com os novos dados
        const update = await  Interface.updateOne(
            { "devices._id":id }, // Condição para encontrar o subdocumento específico
            {
              $set: {
                "devices.$[device].isOnline": status // Atualiza o campo isOnline dentro do subdocumento específico
              }
            },
            {
              arrayFilters: [{ "device._id": id }] // Filtro para aplicar a atualização no subdocumento correto
            }
          ).exec();
         // console.log("id", id)

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



 
module.exports = {
   
    getById,
    getByCondition,
    getActiveDevices,
    setDeviceOnline
};
