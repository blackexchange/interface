import axios from './BaseService';

const URL = `${process.env.REACT_APP_API_URL}/exams/`;

// Função para buscar todos os equipamentos
export async function getAll(token) {
    const headers = { 'authorization': token };
    const response = await axios.get(URL, { headers });
    return response.data;
}

// Função para buscar um equipamento por ID
export async function getOne(token, id) {
    const headers = { 'authorization': token };
    const response = await axios.get(`${URL}${id}/`, { headers });
    return response.data;
}

// Função para criar um novo equipamento
export async function createOne(token, equipment) {
    const headers = { 'authorization': token };
    const response = await axios.post(URL, equipment, { headers });
    return response.data;
}

// Função para atualizar um equipamento existente
export async function updateOne(token, id, equipment) {
    const headers = { 'authorization': token };
    const response = await axios.put(`${URL}${id}/`, equipment, { headers });
    return response.data;
}

// Função para deletar um equipamento
export async function deleteOne(token, id) {
    const headers = { 'authorization': token };
    const response = await axios.delete(`${URL}${id}/`, { headers });
    return response.data;
}
