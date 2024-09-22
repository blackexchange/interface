const {Interface} = require('../models/interfaceModel');



function createInterface(interface, session) {
    return Interface.insertMany(interface, { session });
}

function getInterfaces() {
    return Interface.find({}).exec();
}

function deleteInterface(id, session) {
    return Interface.findByIdAndDelete(id).session(session).exec();
}

async function getInterfaceByCondition(condition) {
    try {
        // Log para verificar o que está sendo passado


        const result = await Interface.aggregate(
            condition, { allowDiskUse: true }
            
            ).exec();
        return result;
    
      } catch (error) {
        console.error('Erro ao buscar dispositivos ativos:', error);
      }
};


function getInterfaceById(id) {
    return Interface.findById(id).exec();
}



async function updateInterface(id, newObj) {
    try {
        // Encontrar o paciente pelo ID e atualizar com os novos dados
        const updatedInterface = await Interface.findOneAndUpdate(
            { _id: id }, // Filtro para encontrar o paciente pelo ID
            { $set: newObj }, // Atualizar os campos com os novos dados
            { new: true } // 'new: true' retorna o documento atualizado
        ).exec();

        if (!updatedInterface) {
            // Se nenhum paciente foi encontrado, retornar uma mensagem de erro
            return {
                success: false,
                error: 'Interface not found.'
            };
        }

        // Retornar um objeto indicando sucesso
        return {
            success: true,
            data: updatedInterface
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

    createInterface,
    getInterfaces,
    deleteInterface,
    getInterfaceByCondition,
    updateInterface,
    getInterfaceById


};
