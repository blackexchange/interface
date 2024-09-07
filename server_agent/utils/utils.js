const fs = require('fs');
const path = require('path');

function getNetworkTime() {
    const ntpClient = require('ntp-client');

    return new Promise((resolve, reject) => {
        ntpClient.getNetworkTime("time.google.com", 123, (err, date) => {
            if (err) {
                reject(err);
            } else {
                resolve(date);
            }
        });
    });
}


class Utils {
    /**
     * Método para converter uma string em formato de data legível.
     * @param {string} dateString - String de data ISO.
     * @returns {string} Formato legível de data.
     */
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    static logMessage(message, direction) {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} \t${direction} \t${message}\n-----------------------------------------------\n`;
        
        // Escreve no arquivo de log, criando o arquivo se não existir, ou anexando se já existir
        fs.appendFile('server_log.txt', logMessage, err => {
            if (err) throw err;
            console.log('Log gerado no arquivo server_log.txt!');
        });
    }
    
    static formatDateTime(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() retorna mês de 0 a 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
    
        // Preenchendo com zero à esquerda para garantir que cada parte tenha o tamanho correto
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    
        return `${year}${formattedMonth}${formattedDay}${formattedHours}${formattedMinutes}${formattedSeconds}`;
    }

    /**
     * Método para verificar se um número é primo.
     * @param {number} num - Número para verificar.
     * @returns {boolean} Verdadeiro se primo, falso caso contrário.
     */
    static isPrime(num) {
        if (num <= 1) return false;
        if (num <= 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;
        for (let i = 5; i * i <= num; i += 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
        }
        return true;
    }

    /**
     * Método para gerar uma string aleatória de tamanho específico.
     * @param {number} length - Tamanho da string desejada.
     * @returns {string} String aleatória.
     */
    static generateRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static incrementNumericPart(inputString) {
        let msgType = inputString.split('^')[0];

        switch (msgType) {
            case 'QRY':
                inputString = inputString.replace(msgType,'QCK')
                break;
            default:
                inputString = inputString.replace(msgType,'ACK')

                break;
        }
        
        inputString = inputString.replace('QRY',)
        // Encontrar e capturar o segmento numérico no final da string
        return inputString.replace(/(\d+)$/, (match) => {
            // Converter o segmento numérico para um número, incrementar e converter de volta para string
            const number = parseInt(match, 10) + 1;
            // Manter o mesmo número de dígitos (preenchendo com zeros se necessário)
            return number.toString().padStart(match.length, '0');
        });
    }

    
static getDateTime() {
    const isoDate = new Date().toISOString(); // Exemplo: "2024-08-03T18:02:55.978Z"
    const basicDateTime = isoDate
        .replace(/-|:|\.|T|\..*|Z/g, '') // Remove hifens, dois pontos, a fração de segundo e o 'Z'
        .slice(0, 14); // Garante que apenas os primeiros 14 caracteres (YYYYMMDDHHMMSS) sejam pegos
    return basicDateTime;
}

static async sistemaValido() {

    const specificDate = new Date('2024-09-10T00:00:00Z');
  
    try {
        const date = await getNetworkTime();
        // Verificar a data - exemplo: verificar se a data é após 10 de agosto de 2024
        const ret = specificDate > date ;
        return  ret ;
    } catch (error) {
        console.error("Erro ao obter a hora do servidor NTP:", error);
    }

}

 

static  readFileSync(filePath) {
    try {
        // Lê o arquivo de forma síncrona
        const data = fs.readFileSync(filePath, 'utf8');
        console.log("Conteúdo do arquivo:", data);
        return data;  // Retorna os dados lidos
    } catch (err) {
        console.error("Erro ao ler o arquivo:", err);
        throw err;  // Propaga o erro para que o chamador possa lidar com ele
    }
}

static async  getOrderFile(){

// Caminho para o arquivo que você quer ler 
   const filePath = path.join(__dirname, 'order_file.txt');
   try {
    const fileContent = fs.readFileSync(filePath);
    return fileContent;
    // Aqui você pode fazer mais operações com fileContent
    } catch (error) {
        console.error("Erro ao obter os dados do arquivo:", error);
    }

}
    
}

module.exports = Utils;
