const {Order} = require('../models/orderModel');
const {Patient} = require('../models/patientModel');
const {Interface} = require('../models/interfaceModel');
const { ObjectId } = require('mongodb');


const title = 'Order';

function createOne(obj, session) {
    return Order.insertMany(obj, { session });
}

function getAll() {
    return Order.find().exec();
}

function deleteOne(id, session) {
    return Order.findByIdAndDelete(id).session(session).exec();
}

function getByCondition(condition) {
    return Order.find(condition).exec();
}


function getById(id) {
    return Order.findById(id).exec();
}

async function getInterfaceData(orders) {
   
    orders.forEach(orderInterface => {

        console.log(orderInterface._id)
        
        orders.forEach(orderInterface => {

            console.log(orderInterface._id)
            
    
        });


    });
        
 }
 


async function getInterfaceData_(data) {

    const examObject = data.map(o => {
            exams = o.exams.map(e => e);
            return exams;
        }
    )[0];

    const examCodes = data.map(o => {
        exams = o.exams.map(e => e._id);
        return exams;
        }
    )[0];
    


    try{
  
        if (!examCodes> 0 ){
            
        }else{
            const interfaces =  await Interface.find({
                "exams.code" : { $in: examCodes},
                active:true
            }).exec();
    
            if (interfaces.length <= 0){
    
                console.log('NO')
            }else{
                ret = mapExamsToInterfaces(examObject, interfaces);
                const data2 = {
                    ...ret,
                    patient:data[0].patient,  // Adiciona o ID do usuário que enviou a requisição
                };
                
                
                console.log('axams',data2)
            }

        }

     

/*
        // Mapear os exames disponíveis na interface para uma fácil verificação
        const availableExams = interfaces.map(i => i.name);

        // Verificar quais exames do pedido são válidos
        const validExams = order.exams.filter(exam => availableExams.includes(exam.code));

        console.log('Valid Exams:', validExams);

        return {
            patient: order.patient,
            validExams,
            totalExams: order.exams.length,
            validExamsCount: validExams.length
        };*/
    } catch (error) {
        console.error('Error verifying exams:', error.message);
        throw error;
    }
}

function mapExamsToInterfaces(exams, interfaces) {
    const result = {};

    interfaces.forEach(interfaceObj => {
        const examsForInterface = exams
            .filter(exam => 
                interfaceObj.exams.some(examObj => 
                    examObj.code.toString() === exam._id.toString() // Compara como string
                )
            )
            .map(exam => ({
                _id: exam._id,
                code: exam.code,
                name: exam.name,
                material: exam.material,
                barCode: exam.barCode // Certifique-se de que barCode esteja presente no objeto exam
            }));
    
        result[interfaceObj.name] = examsForInterface;
    });

    return result;
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
    getByCondition,
    getInterfaceData
};
