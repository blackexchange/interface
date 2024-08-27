import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o useNavigate
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer/Footer';
import Toast from '../../components/Toast/Toast';
import PatientsRow from './PatientsRow';
import { getPatients } from '../../services/PatientsService';

function Patients() {
    const [patients, setPatients] = useState([]);
    const [filters, setFilters] = useState({ name: '', gender:'',document: '', birthOfDate: '' });
    const [notification, setNotification] = useState({});
    const navigate = useNavigate(); // Usando o useNavigate para navegação

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchPatients();
    }, [filters]);

    function fetchPatients() {
        getPatients(token)
            .then((data) => {
                const filteredPatients = data.filter(patient => 
                    (filters.name ? patient.name.includes(filters.name) : true) &&
                    (filters.document ? patient.document.includes(filters.document) : true) &&
                    (filters.date ? patient.birthday.includes(filters.date) : true)
                );
                setPatients(filteredPatients);
            })
            .catch((error) => {
                console.error('Error fetching patients:', error);
                setNotification({ type: 'error', text: 'Failed to load patients' });
            });
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFilters(prevState => ({ ...prevState, [name]: value }));
    }

    return (
        <>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h1 className="h4">Patients</h1>
                    </div>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <button className="btn btn-primary" onClick={() => navigate('/patients/new')}>
                            New Patient
                        </button>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Filter by name"
                            name="name"
                            value={filters.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Filter by document"
                            name="document"
                            value={filters.document}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="date"
                            className="form-control"
                            placeholder="Filter by date"
                            name="date"
                            value={filters.date}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card card-body border-0 shadow mb-4">
                            <div className="table-responsive divScroll">
                                <table className="table align-items-center table-flush table-sm table-hover tableFixHead">
                                    <thead className="thead-light">
                                        <tr>
                                            <th className="border-bottom" scope="col">Name</th>
                                            <th className="border-bottom" scope="col">Birthday</th>
                                            <th className="border-bottom" scope="col">Sex</th>
                                            <th className="border-bottom" scope="col">Document</th>
                                            <th className="border-bottom" scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            patients.length > 0 ? (
                                                patients.map(patient => (
                                                    <PatientsRow
                                                        key={patient.id}
                                                        patient={patient}
                                                        navigate={navigate} // Passando navigate para as ações
                                                        setNotification={setNotification}
                                                    />
                                                ))
                                            ) : (
                                                <tr><td colSpan="5" className="text-center">No patients found</td></tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
            <Toast text={notification.text} type={notification.type} />
        </>
    );
}

export default Patients;
