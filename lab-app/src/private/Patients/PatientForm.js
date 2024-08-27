import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Importando useNavigate e useParams
import { createPatient, updatePatient, getPatientById } from '../../services/PatientsService';
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer/Footer';
import Toast from '../../components/Toast/Toast';

function PatientsForm() {
    const [patient, setPatient] = useState({ name: '', dateOfBirth: '', gender: '', document: '' , phone:'', email:''});
    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState({});
    
    const { id } = useParams(); // Usando useParams para obter o ID da URL
    const navigate = useNavigate(); // Usando useNavigate para navegação
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            getPatientById(token, id)
                .then((data) => setPatient(data))
                .catch((error) => {
                    console.error('Error fetching patient:', error);
                    setNotification({ type: 'error', text: 'Failed to load patient data' });
                });
        }
    }, [id, token]);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setPatient(prevState => ({ ...prevState, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (isEditing) {
            updatePatient(token, patient._id, patient)
                .then(() => {
                    setNotification({ type: 'success', text: 'Patient updated successfully' });
                    navigate('/patients');
                })
                .catch((error) => {
                    console.error('Error updating patient:', error);
                    setNotification({ type: 'error', text: 'Failed to update patient' });
                });
        } else {
            createPatient(token, patient)
                .then(() => {
                    setNotification({ type: 'success', text: 'Patient created successfully' });
                    navigate('/patients');
                })
                .catch((error) => {
                    console.error('Error creating patient:', error);
                    setNotification({ type: 'error', text: 'Failed to create patient' });
                });
        }
    }

    return (
        <>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h1 className="h4">{isEditing ? 'Edit Patient' : 'New Patient'}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card card-body border-0 shadow mb-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                name="name"
                                                value={patient.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="form-group">
                                            <label htmlFor="birthday">Birthday</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="dateOfBirth"
                                                name="dateOfBirth"
                                                value={patient.dateOfBirth}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div className="form-group">
                                            <label htmlFor="sex">Sex</label>
                                            <select
                                                className="form-control"
                                                id="sex"
                                                name="gender"
                                                value={patient.gender}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select</option>
                                                <option value="MALE">Male</option>
                                                <option value="FEMALE">Female</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="form-group">
                                            <label htmlFor="document">Document</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="document"
                                                name="document"
                                                value={patient.document}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <button className="btn btn-primary mt-2" type="submit">
                                            {isEditing ? 'Update Patient' : 'Create Patient'}
                                        </button>
                                        <button
                                            className="btn btn-secondary mt-2 ms-2"
                                            type="button"
                                            onClick={() => navigate('/patients')}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
            <Toast text={notification.text} type={notification.type} />
        </>
    );
}

export default PatientsForm;
