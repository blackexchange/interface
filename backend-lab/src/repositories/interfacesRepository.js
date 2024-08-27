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

function getInterfaceByCondition(condition) {
    return Interface.find(condition).exec();
}

function getInterfaceById(id) {
    return Interface.findById(id).exec();
}



async function updateInterface(id, newObj) {
    try {
        // Encontrar o paciente pelo ID e atualizar com os novos dados
        const updatedPatient = await Interface.findOneAndUpdate(
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
