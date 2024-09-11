const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.URL_APP || 'http://localhost:3000';

async function sendData(rawData, client, params) {
    const data = {
        data:rawData,
        client: {id:client.clientId, token:client.token},
        params:params
    };

    const url = `${API_URL}/raw`;
    try{

        const response = await axios.post(url, data);
        return response.data;
    }catch (e){
        console.log (e);

    }
}

// Exportar a função usando CommonJS
module.exports = {
    sendData
};
