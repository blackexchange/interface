
const logger = require('./utils/logger');

let WSS

function startMiniTickerMonitor(monitorId, broadcastLabel, logs) {
    sendMessage({ notification: "s" });
   /* if (!exchange) return new Error('Exchange Monitor not initialized yet.');
    exchange.miniTickerStream(async (markets) => {
        if (logs) logger('M:' + monitorId, markets);

        try {
            Object.entries(markets).map(async (mkt) => {

                delete mkt[1].volume;
                delete mkt[1].quoteVolume;
                delete mkt[1].eventTime;
                const converted = {};
                Object.entries(mkt[1]).map(prop => converted[prop[0]] = parseFloat(prop[1]));

                const results = await beholder.updateMemory(mkt[0], indexKeys.MINI_TICKER, null, converted);
                if (results) results.map(r => sendMessage({ notification: r }));
            })

            if (broadcastLabel && WSS) sendMessage({ [broadcastLabel]: markets });

            //simulação de book
            const books = Object.entries(markets).map(mkt => {
                const book = { symbol: mkt[0], bestAsk: mkt[1].close, bestBid: mkt[1].close };
                const currentMemory = beholder.getMemory(mkt[0], indexKeys.BOOK);

                const newMemory = {};
                newMemory.previous = currentMemory ? currentMemory.current : book;
                newMemory.current = book;

                beholder.updateMemory(mkt[0], indexKeys.BOOK, null, newMemory)
                    .then(results => {
                        if (results)
                            results.map(r => sendMessage({ notification: r }));
                    })

                return book;
            })
            //if (WSS) sendMessage({ book: books });
            //fim da simulação de book

        } catch (err) {
            if (logs) logger('M:' + monitorId, err)
        }
    })*/
    logger('M:' + monitorId, 'Mini Ticker Monitor has started!');
}


async function sendMessage(json) {

    return WSS.broadcast(json);
}

async function init(wssInstance) {
    
   // if (!settings ) throw new Error(`You can't init the Exchange Monitor App without his settings. Check your database and/or startup code.`);

    WSS = wssInstance;
    //beholder = beholderInstance;
    //exchange = require('./utils/exchange')(settings);

   // const monitors = await getActiveMonitors();

    const monitors = [{
        id: "d",
        broadcastLabel:"asdsa",
        logs:"s",
        type:"mini"
    }]
    monitors.map(m => {
        setTimeout(() => {
            switch (m.type) {
                case "mini":
                    
                    return startMiniTickerMonitor(m.id, m.broadcastLabel, m.logs);
                case monitorTypes.BOOK:
                //    return startBookMonitor(m.id, m.broadcastLabel, m.logs);
                case monitorTypes.USER_DATA: {
                  //  if (!settings.accessKey || !settings.secretKey) return;
                   // return startUserDataMonitor(m.id, m.broadcastLabel, m.logs);
                }
                case monitorTypes.CANDLES:
                    //return startChartMonitor(m.id, m.symbol, m.interval, m.indexes ? m.indexes.split(',') : [], m.broadcastLabel, m.logs);
                case monitorTypes.TICKER:
                    //return startTickerMonitor(m.id, m.symbol, m.broadcastLabel, m.logs);
            }
        }, 250)//Binance only permits 5 commands / second
    })

   

    logger('system', 'App Exchange Monitor is running!');
}

module.exports = {
    init,
    sendMessage
}