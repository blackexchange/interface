const database = require('./db');
const app = require('./app');
const logger = require('./utils/logger');
const appEm = require('./app-em');
const appWs = require('./app-ws');
const { monitorNewInterfaces, monitorStatusDevices } = require('./services/changeStreamWatcher');


(async () => {
    

   logger('system', `Starting the server apps...`);
    const server = app.listen(process.env.PORT, () => {
        logger('system', 'App is running at ' + process.env.PORT);
      // console.log('system', 'App is running at ' + process.env.PORT);
    })


    const wss = appWs(server);

    appEm.init(wss);
    monitorNewInterfaces();
    monitorStatusDevices();




})();