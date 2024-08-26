const Partner = require('../models/partnerModel');



function createPartner(partner, session) {
    return Partner.insertMany(partner, { session });
}


async function updatePartner(id, newpartner) {
    try {
        // Encontrar o paciente pelo ID e atualizar com os novos dados
        const updatePartner = await Partner.findOneAndUpdate(
            { _id: id }, // Filtro para encontrar o paciente pelo ID
            { $set: newpartner }, // Atualizar os campos com os novos dados
            { new: true } // 'new: true' retorna o documento atualizado
        ).exec();

        if (!updatePartner) {
            // Se nenhum paciente foi encontrado, retornar uma mensagem de erro
            return {
                success: false,
                error: 'partner not found.'
            };
        }

        // Retornar um objeto indicando sucesso
        return {
            success: true,
            data: updatePartner
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

    createPartner,
    updatePartner
};
