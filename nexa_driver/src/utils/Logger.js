class Logger {
    static log(message, level = 'INFO') {
        console.log(`[${level}] - ${new Date().toISOString()} - ${message}`);
    }
}

module.exports = Logger;
