const net = require('net');
const { Interface } = require('../models/interfaceModel');
const { dispatchProtocol } = require('../utils/protocolDispatcher');
const Logger = require('../utils/Logger'); // Incluindo o Logger se necessário

function openPortForDevice(device, name) {
  const protocolProcessor = dispatchProtocol(device);

  if (device.role === 'server') {
    // Criar um servidor TCP

    protocolProcessor.startTCPServer();

  

  } else if (device.role === 'client') {
    // Criar um cliente TCP
    protocolProcessor.startTCPConnection();

}
}


function handleDeviceConnection(socket, protocolProcessor, device) {
  let buffer = '';  // Armazenar os dados recebidos

  

  socket.on('data', async (data) => {
    buffer += Buffer.from(data);  // Acumula os dados no buffer

    // Processa os dados recebidos
    const ret = await protocolProcessor.receiveMessage(buffer, device, socket);

    // Limpa o buffer após processar (opcional, se o protocolo não for contínuo)
    buffer = '';

    sendNextMessage(socket);

  });

  socket.on('end', () => {
    console.log('Dispositivo desconectado.');
  });

  socket.on('error', (err) => {
    console.error(`Erro de socket: ${err.message}`);
  });
}

// Função para gerenciar conexões para interfaces e dispositivos
async function manageConnections() {
  console.log("Ativando interfaces...");

  try {
    // Buscando todas as interfaces com dispositivos ativos
    const activeInterfaces = await Interface.find({ 'devices.status': 'active' }).exec();
    if (activeInterfaces.length === 0) {
      console.log("Nenhuma interface ativa encontrada.");
      return;
    }

    // Iterando sobre as interfaces ativas
    activeInterfaces.forEach((interfaceItem) => {
      console.log(`Ativando interface: ${interfaceItem.name}`);

      // Iterando sobre os dispositivos de cada interface
      interfaceItem.devices.forEach((device) => {
        device = device.toObject();

        if (device.status === 'active') {
          // Abrindo a porta para o dispositivo
          try {
            openPortForDevice(device, interfaceItem.name);
          } catch (err) {
            console.error(`Erro ao abrir porta para dispositivo ${device.deviceId}: ${err.message}`);
          }
        }
      });

      console.log(`Todas as portas para a interface ${interfaceItem.name} foram abertas.`);
    });

  } catch (err) {
    console.error(`Erro ao buscar interfaces ativas: ${err.message}`);
  }
}

module.exports = { manageConnections, openPortForDevice }
