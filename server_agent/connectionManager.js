const net = require('net');
const { Interface } = require('./interface');

// Função para abrir portas para todos os dispositivos da interface
function openPortForDevice(device, retryCount = 0) {
  const MAX_RETRIES = 5; // Defina um limite de tentativas para evitar loops infinitos

  console.log(`Abrindo porta para o dispositivo: ${device.deviceId}`);

  // Criando o servidor TCP
  const server = net.createServer((socket) => {
    console.log(`Dispositivo conectado: ${device.deviceId}`);

    // Tratando dados recebidos do dispositivo
    socket.on('data', (data) => {
      console.log(`Dados recebidos de ${device.deviceId}: ${data}`);
    });

    // Quando o dispositivo se desconectar
    socket.on('end', () => {
      console.log(`Dispositivo desconectado: ${device.deviceId}`);
    });

    // Tratando erros de socket
    socket.on('error', (err) => {
      console.error(`Erro de socket no dispositivo ${device.deviceId}: ${err.message}`);
    });
  });

  // Tentando escutar na porta especificada
  server.listen(device.port, device.ip, () => {
    console.log(`Escutando em ${device.ip}:${device.port}`);
  });

  // Tratando erros do servidor (ex: porta já em uso)
  server.on('error', (err) => {
    console.error(`Erro ao abrir a porta para ${device.deviceId} (${device.ip}:${device.port}): ${err.message}`);

    if (err.code === 'EADDRINUSE') {
      if (retryCount >= MAX_RETRIES) {
        console.error(`Falha ao abrir a porta após ${MAX_RETRIES} tentativas para ${device.deviceId}. Abortando.`);
        return;
      }

      console.error(`Porta ${device.port} já está em uso para o dispositivo ${device.deviceId}. Tentando novamente...`);

      // Tentando novamente após 1 segundo
      setTimeout(() => {
        server.close(() => {
          console.log(`Servidor fechado para ${device.deviceId}. Tentando reabrir a porta...`);
          openPortForDevice(device, retryCount + 1); // Incrementa o contador de tentativas
        });
      }, 1000);
    }
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
            openPortForDevice(device);
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
