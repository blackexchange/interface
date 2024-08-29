import React, { useState } from 'react';
import { searchPatients } from '../../services/PatientsService';

function SelectPatient({ token, onSelectPatient }) {
    const [query, setQuery] = useState('');
    const [patients, setPatients] = useState([]);

    function handleSearchChange(event) {
        setQuery(event.target.value);
        if (event.target.value.length > 2) {
            searchPatients(token, event.target.value)
                .then(data => setPatients(data))
                .catch(err => console.error(err));
        } else {
            setPatients([]); // Limpar a lista se a query for muito curta
        }
    }

    function handleSelect(patient) {
        onSelectPatient(patient);
        setQuery(patient.name); // Atualiza o campo de entrada com o nome do paciente selecionado
        setPatients([]); // Limpar a lista de resultados
    }

    return (
        <div className="mb-3">
            <label htmlFor="patientSearch">Search Patient</label>
            <input
                type="text"
                className="form-control"
                id="patientSearch"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search by name or ID"
            />
            {patients.length > 0 && (
                <ul className="list-group mt-2">
                    {patients.map(patient => (
                        <li 
                            key={patient._id} 
                            className="list-group-item list-group-item-action" 
                            onClick={() => handleSelect(patient)}
                            style={{ cursor: 'pointer' }}
                        >
                            {patient.name} - {patient.id}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SelectPatient;
