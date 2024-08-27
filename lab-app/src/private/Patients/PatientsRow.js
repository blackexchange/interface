import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deletePatient } from '../../services/PatientsService';

function PatientsRow({ patient, history, setNotification }) {
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    function handleDelete() {
        if (window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
            console.log('delet')

            deletePatient(token, patient._id)
                .then(() => {
                    setNotification({ type: 'success', text: 'Patient deleted successfully' });
                    window.location.reload(); 
                })
                .catch((error) => {
                    console.error('Error deleting patient:', error);
                    setNotification({ type: 'error', text: 'Failed to delete patient' });
                });
        }
    }

    return (
        <tr>
            <td>{patient.name}</td>
            <td>{patient.dateOfBirth}</td>
            <td>{patient.gender}</td>
            <td>{patient.document}</td>
            <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/patients/edit/${patient._id}`)}>Edit</button>
                <button className="btn btn-sm btn-danger me-2" onClick={handleDelete}>Delete</button>
                <button className="btn btn-sm btn-info" onClick={() => navigate(`/patients/view/${patient._id}`)}>View</button>
            </td>
        </tr>
    );
}

export default PatientsRow;
