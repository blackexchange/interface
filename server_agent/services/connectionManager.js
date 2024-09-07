const net = require('net');
const { Interface } = require('../models/interfaceModel');
const { dispatchProtocol } = require('../utils/protocolDispatcher');


function openPortForDevice(device, name) {
  const protocolProcessor = dispatchProtocol(device);

  const server = net.createServer((socket) => handleDeviceConnection(socket, protocolProcessor, device));


  server.listen(device, name, () => {
      console.log(`${name}/${device.protocol} escutando em ${device.ip}:${device.port}`);
  });

  server.on('error', (err) => {
      console.error(`Erro ao abrir a porta: ${err.message}`);
  });
}

 function handleDeviceConnection(socket, protocolProcessor, device) {
  let buffer = '';  // Armazenar os dados recebidos

  socket.on('data', async (data) => {
      buffer = data.toString();  // Adiciona os dados ao buffer

     const ret = await protocolProcessor.processData(buffer, device, socket);
     //console.log('resposta', ret)

     // const response = protocolProcessor(buffer);
  
      // Verifica se o final da mensagem foi recebido (usando \x0D como terminador)
      /*
      while (buffer.includes('\x0D')) {
          const messageEndIndex = buffer.indexOf('\x0D');
          
          // Extrai a mensagem completa
          const completeMessage = buffer.slice(0, messageEndIndex);
          buffer = buffer.slice(messageEndIndex + 1); // Remove a mensagem processada do buffer
          
        //  console.log(completeMessage)
          // Agora processa a mensagem completa
         // const response = protocolProcessor(completeMessage);
          
          // Envia a resposta de volta pelo socket
          socket.write("ok");
      }
      */
     // socket.write("ok");

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
            openPortForDevice(device,interfaceItem.name);
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

module.exports = { manageConnections, openPortForDevice };
