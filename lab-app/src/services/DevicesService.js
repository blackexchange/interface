import axios from './BaseService';

const EQUIPMENTS_URL = `${process.env.REACT_APP_API_URL}/interfaces/`;

// Função para buscar todos os equipamentos
export async function getEquipments(token) {
    const headers = { 'authorization': token };
    const response = await axios.get(EQUIPMENTS_URL, { headers });
    return response.data;
}

// Função para buscar um equipamento por ID
export async function getEquipmentById(token, id) {
    const headers = { 'authorization': token };
    const response = await axios.get(`${EQUIPMENTS_URL}${id}/`, { headers });
    return response.data;
}

// Função para criar um novo equipamento
export async function createEquipment(token, equipment) {
    const headers = { 'authorization': token };
    const response = await axios.post(EQUIPMENTS_URL, equipment, { headers });
    return response.data;
}

// Função para atualizar um equipamento existente
export async function updateEquipment(token, id, equipment) {
    const headers = { 'authorization': token };
    const response = await axios.put(`${EQUIPMENTS_URL}${id}/`, equipment, { headers });
    return response.data;
}

// Função para deletar um equipamento
export async function deleteEquipment(token, id) {
    const headers = { 'authorization': token };
    const response = await axios.delete(`${EQUIPMENTS_URL}${id}/`, { headers });
    return response.data;
}
