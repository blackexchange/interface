const os = require('os');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');

const machineUtils = {
    // Função principal para gerar um identificador único
    generateUniqueMachineId() {
        return new Promise((resolve, reject) => {
            const hostname = os.hostname();
            const platform = os.platform();
            const arch = os.arch();
            const networkInterfaces = os.networkInterfaces();
            let macAddress = '';
            let machineId = '';
            
            // Obter o primeiro MAC Address não interno
            for (let interfaceName in networkInterfaces) {
                networkInterfaces[interfaceName].forEach(details => {
                    if (!details.internal && !macAddress) {
                        macAddress = details.mac;
                    }
                });
            }

            // Obter UUID da máquina no Linux
            if (platform === 'linux') {
                this.getLinuxMachineId((id) => {
                    machineId = id || '';
                    resolve(this.generateHash(hostname, macAddress, platform, arch, machineId));
                });
            } else if (platform === 'darwin') {
                // Obter UUID no MacOS
                this.getMacMachineId((id) => {
                    machineId = id || '';
                    resolve(this.generateHash(hostname, macAddress, platform, arch, machineId));
                });
            } else if (platform === 'win32') {
                // Obter UUID no Windows
                this.getWindowsMachineId((id) => {
                    machineId = id || '';
                    resolve(this.generateHash(hostname, macAddress, platform, arch, machineId));
                });
            } else {
                // Para outros sistemas, combinar hostname + MAC
                resolve(this.generateHash(hostname, macAddress, platform, arch, machineId));
            }
        });
    },

    // Função para Linux: Lê o machine-id
    getLinuxMachineId(callback) {
        fs.readFile('/etc/machine-id', 'utf8', (err, data) => {
            if (err) {
                return callback(null);
            }
            return callback(data.trim());
        });
    },

    // Função para MacOS: Obtém o UUID do volume
    getMacMachineId(callback) {
        exec('diskutil info / | grep "Volume UUID"', (error, stdout) => {
            if (error) {
                return callback(null);
            }
            const match = stdout.match(/Volume UUID: (.*)/);
            if (match) {
                return callback(match[1].trim());
            }
            return callback(null);
        });
    },

    // Função para Windows: Usa wmic para obter o UUID da máquina
    getWindowsMachineId(callback) {
        exec('wmic csproduct get UUID', (error, stdout) => {
            if (error) {
                return callback(null);
            }
            const lines = stdout.split('\n');
            if (lines[1]) {
                return callback(lines[1].trim());
            }
            return callback(null);
        });
    },

    // Função auxiliar para gerar hash de todos os dados
    generateHash(hostname, macAddress, platform, arch, machineId) {
        const uniqueData = `${hostname}-${macAddress}-${platform}-${arch}-${machineId}`;
        return crypto.createHash('sha256').update(uniqueData).digest('hex');
    }
};

module.exports = machineUtils;
