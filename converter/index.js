const { SerialPort } = require('serialport');
const net = require('net');
const fs = require('fs');

// Carregar as configurações do arquivo config.json
const configPath = './config.json';
let config;

try {
  const rawConfig = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(rawConfig);
  console.log('Configurações carregadas:', config);
} catch (err) {
  console.error('Erro ao ler o arquivo de configuração:', err);
  process.exit(1);  // Encerrar o processo se não conseguir carregar o arquivo
}

// Função para conectar ao servidor TCP e à porta serial
function connectToServer() {
  const client = new net.Socket();

  client.connect(config.server_port, config.server_ip, () => {
    console.log(`Conectado ao servidor central em ${config.server_ip}:${config.server_port}`);

    // Tentar abrir a porta serial
    const comPort1 = new SerialPort({
      path: config.serial_port,  // Caminho da porta serial (ex.: 'COM4' no Windows, '/dev/ttyUSB0' no Linux)
      baudRate: config.baud_rate || 9600,
      dataBits: config.dataBits || 8,    // Padrão (configurável)
      stopBits: config.stopBits || 1,    // Padrão (configurável)
      parity: config.parity || 'none', // Padrão (configurável)
      autoOpen: true , // Abre a porta automaticamente
      highWaterMark: 16384,  
    });

    comPort1.on('open', () => {
      console.log(`Porta serial ${config.serial_port} aberta com sucesso`);
    });

    // Enviar dados da porta serial para o servidor TCP
    comPort1.on('data', (serialData) => {
      console.log('Dados recebidos da Serial:', serialData.toString());
      client.write(serialData, (err) => {
        if (err) {
          console.error('Erro ao enviar dados para o servidor TCP:', err.message);
        } else {
          console.log('Dados enviados ao servidor TCP.');
        }
      });
    });

    // Receber dados do servidor TCP e encaminhar para a porta serial
    client.on('data', (tcpData) => {
      console.log('Dados recebidos do TCP:', tcpData.toString());
      comPort1.write(tcpData, (err) => {
        if (err) {
          console.error('Erro ao enviar dados para a porta serial:', err.message);
        } else {
          console.log('Dados enviados para a porta serial.');
        }
      });
    });

    // Tratamento de erro ao abrir a porta serial
    comPort1.on('error', (err) => {
      console.error(`Erro na porta serial ${config.serial_port}:`, err.message);
    });
  });

  // Reconectar em caso de erro ou desconexão
  client.on('close', () => {
    console.log('Conexão fechada, tentando reconectar...');
    setTimeout(connectToServer, 5000);  // Tentar reconectar após 5 segundos
  });

  client.on('error', (err) => {
    console.error('Erro na conexão TCP:', err.message);
    client.destroy();  // Forçar fechamento da conexão
  });
}

// Iniciar a conexão ao servidor
connectToServer();
