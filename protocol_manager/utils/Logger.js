const fs = require('fs');
const path = require('path');

class Logger {
    static log(message, level = 'INFO') {
        const logMessage = `[${new Date().toISOString()}] [${level}] ${message}`;
        console.log(logMessage);
        fs.appendFileSync(path.join(__dirname, '../logs/system.log'), logMessage + '\n');
    }
}

module.exports = Logger;
