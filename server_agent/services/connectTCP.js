const interfaceRepository = require('../repositories/InterfaceRepository');

const { dispatchProtocol } = require('../utils/protocolDispatcher');
const Logger = require('../utils/Logger'); // Incluindo o Logger se necessário

//const enabledDevices = process.env.DEVICES_ENABLE ? process.env.DEVICES_ENABLE.split(',') : null;
const enabledDevices = null;

function openPortForDevice(device, name) {
  const protocolProcessor = dispatchProtocol(device);

  if (device.role === 'server') {
    protocolProcessor.startTCPServer();
  } else if (device.role === 'client') {
    protocolProcessor.startTCPConnection();
  }
  
}


// Função para gerenciar conexões para interfaces e dispositivos
async function manageConnections() {
  console.log("Ativando interfaces...");

  try {
    // Buscando todas as interfaces com dispositivos ativos
    //const activeInterfaces = await interfaceRepository.find({ 'devices.status': 'active' }).exec();
    const activeInterfaces =  interfaceRepository.getActiveDevices();
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
        if (device.status === 'active' && (!enabledDevices || enabledDevices.includes(device.deviceId))) {
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
