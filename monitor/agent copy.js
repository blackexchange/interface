//const dbCon = require('./dbCon');
const database = require('./connections/db');
const consumeOrder = require('./queues/consumeOrders');


//dbCon.fetchDBEvents();

consumeOrder.consumeOrders();

// Agendar a função para rodar a cada minuto

setInterval(dbCon.fetchDBEvents, 6000);



/*
pm2 start timer.js --name="TimerJob"


pm2 startup


pm2 logs TimerJob
pm2 status
pm2 monit
*/