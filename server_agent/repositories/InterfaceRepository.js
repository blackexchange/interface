const {Interface} = require('../models/interfaceModel');

const title = 'Interface';


function createOne(obj, session) {
    return Exam.insertMany(obj, { session });
}

function getAll() {
    return Interface.find().exec();
}

function getActiveDevices() {
    return Interface.find({ 'devices.status': 'active' }).exec();
}

function deleteOne(id, session) {
    return Exam.findByIdAndDelete(id).session(session).exec();
}

function getByCondition(condition) {
    return Exam.find(condition).exec();
}

function getById(id) {
    return Exam.findById(id).exec();
}

async function setDeviceOnline(id, status) {
    try {
        // Encontrar o paciente pelo ID e atualizar com os novos dados
        const update = await  Interface.updateOne(
            { "devices._id": ObjectId(id) }, // Condição para encontrar o subdocumento específico
            {
              $set: {
                "devices.$[device].isOnline": status // Atualiza o campo isOnline dentro do subdocumento específico
              }
            },
            {
              arrayFilters: [{ "device._id": ObjectId(id) }] // Filtro para aplicar a atualização no subdocumento correto
            }
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


async function updateOne(id, newObj) {
    try {
        // Encontrar o paciente pelo ID e atualizar com os novos dados
        const update = await Exam.findOneAndUpdate(
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

 
module.exports = {
    createOne,
    deleteOne,
    getAll,
    updateOne,
    getById,
    getByCondition,
    getActiveDevices,
    setDeviceOnline
};
