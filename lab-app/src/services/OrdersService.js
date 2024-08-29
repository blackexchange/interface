import axios from './BaseService';

const URL = `${process.env.REACT_APP_API_URL}/orders/`;

// Função para buscar todos os pedidos
export async function getAll(token) {
    const headers = { 'authorization': token };
    const response = await axios.get(URL, { headers });
    return response.data;
}

// Função para buscar um pedido por ID
export async function getOne(token, id) {
    const headers = { 'authorization': token };
    const response = await axios.get(`${URL}${id}/`, { headers });
    return response.data;
}

// Função para criar um novo pedido
export async function createOne(token, order) {
    const headers = { 'authorization': token };
    const response = await axios.post(URL, order, { headers });
    return response.data;
}

// Função para atualizar um pedido existente
export async function updateOne(token, id, order) {
    const headers = { 'authorization': token };
    const response = await axios.put(`${URL}${id}/`, order, { headers });
    return response.data;
}

// Função para deletar um pedido
export async function deleteOne(token, id) {
    const headers = { 'authorization': token };
    const response = await axios.delete(`${URL}${id}/`, { headers });
    return response.data;
}
