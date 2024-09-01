const {LabOrder} = require('../models/labOrderModel');
const {Patient} = require('../models/patientModel');
const {Interface} = require('../models/interfaceModel');
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
 
module.exports = {
    createOne,
    deleteOne,
    getAll,
    updateOne,
    getById,
    getByCondition
};
