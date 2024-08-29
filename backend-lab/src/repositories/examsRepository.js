const {Exam} = require('../models/examModel');

const title = 'Exam';

function createOne(obj, session) {
    return Exam.insertMany(obj, { session });
}

function getAll() {
    return Exam.find().exec();
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
    getByCondition
};
