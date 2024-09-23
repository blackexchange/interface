import axios from './BaseService';

const RESULTS_URL = `${process.env.REACT_APP_API_URL}/results`;

export async function getAll(token) {

    const headers = { 'authorization': token };
    const response = await axios.get(RESULTS_URL, { headers });
    return response.data;//{count, rows}
}
