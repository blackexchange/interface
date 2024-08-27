import axios from './BaseService';

const PATIENTS_URL = `${process.env.REACT_APP_API_URL}/patients/`;

// Função para buscar todos os pacientes
export async function getPatients(token) {
    const headers = { 'authorization': token };
    const response = await axios.get(PATIENTS_URL, { headers });
    return response.data;
}

// Função para criar um novo paciente
export async function createPatient(token, patient) {
    const headers = { 'authorization': token };
    const response = await axios.post(PATIENTS_URL, patient, { headers });
    return response.data;
}

// Função para atualizar um paciente existente
export async function updatePatient(token, id, patient) {
    const headers = { 'authorization': token };
    const response = await axios.put(`${PATIENTS_URL}${id}/`, patient, { headers });
    return response.data;
}

// Função para deletar um paciente
export async function deletePatient(token, id) {
    const headers = { 'authorization': token };
    const response = await axios.delete(`${PATIENTS_URL}${id}/`, { headers });
    return response.data;
}

// Função para buscar um paciente pelo ID
export async function getPatientById(token, id) {
    const headers = { 'authorization': token };
    const response = await axios.get(`${PATIENTS_URL}${id}/`, { headers });
    return response.data;
}

// Função para buscar pacientes com filtros
export async function searchPatients(token, filters) {
    const headers = { 'authorization': token };
    const queryString = Object.entries(filters)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
    const response = await axios.get(`${PATIENTS_URL}?${queryString}`, { headers });
    return response.data;
}
