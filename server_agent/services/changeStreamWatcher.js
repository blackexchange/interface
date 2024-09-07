const { Interface } = require('../models/interfaceModel'); // Modelo da interface
const { openPortForDevice } = require('./connectionManager'); // Função que abre as portas

// Função para iniciar o monitoramento de mudanças no MongoDB
async function monitorNewInterfaces() {
    try {
        // Monitora mudanças na coleção "Interface"
        const changeStream = Interface.watch();

        console.log("Monitorando mudanças na coleção de interfaces...");

        // Lida com as mudanças observadas
        changeStream.on('change', (change) => {
            if (change.operationType === 'insert') {
                const newInterface = change.fullDocument;

                console.log(`Nova interface detectada: ${newInterface.name}`);

                // Abre a porta para cada dispositivo ativo da nova interface
                newInterface.devices.forEach((device) => {
                    if (device.status === 'active') {
                        openPortForDevice(device); // Abre a porta automaticamente
                    }
                });
            }

            if (change.operationType === 'update') {
                const updatedFields = change.updateDescription.updatedFields;
                const updatedInterfaceId = change.documentKey._id;

                console.log(`Interface atualizada: ${updatedInterfaceId}`, updatedFields);

                // Aqui, você pode adicionar lógica para atualizar as portas, se necessário
            }

            if (change.operationType === 'delete') {
                const deletedInterfaceId = change.documentKey._id;
                console.log(`Interface removida: ${deletedInterfaceId}`);

                // Aqui, você pode adicionar lógica para fechar portas, se necessário
            }
        });

        // Lida com erros no Change Stream
        changeStream.on('error', (error) => {
            console.error(`Erro no Change Stream: ${error.message}`);
        });
    } catch (error) {
        console.error(`Erro ao iniciar monitoramento de interfaces: ${error.message}`);
    }
}

module.exports = { monitorNewInterfaces };
