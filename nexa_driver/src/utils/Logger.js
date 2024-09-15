class Logger {
    static log(message, device ={}, level = 'INFO') {
        console.log(`[${level}] - ${new Date().toISOString()} - ${message}`);
    }


}

module.exports = Logger;
