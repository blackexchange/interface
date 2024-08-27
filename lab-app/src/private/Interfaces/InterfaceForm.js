import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEquipment, updateEquipment, getEquipmentById } from '../../services/InterfacesService';
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer/Footer';
import Toast from '../../components/Toast/Toast';

function InterfaceForm() {
    const [equipment, setEquipment] = useState({
        name: '',
        brand: '',
        model: '',
        code: '',
        area: '',
        protocol: '',
        testLevel: '',
        exams: [],
        active: false,
        actualSetup: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState({});
    
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            getEquipmentById(token, id)
                .then((data) => setEquipment(data))
                .catch((error) => {
                    console.error('Error fetching equipment:', error);
                    setNotification({ type: 'error', text: 'Failed to load equipment data' });
                });
        }
    }, [id, token]);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setEquipment(prevState => ({ ...prevState, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (isEditing) {
            updateEquipment(token, id, equipment)
                .then(() => {
                    setNotification({ type: 'success', text: 'Equipment updated successfully' });
                    navigate('/interfaces');
                })
                .catch((error) => {
                    console.error('Error updating equipment:', error);
                    setNotification({ type: 'error', text: 'Failed to update equipment' });
                });
        } else {
            createEquipment(token, equipment)
                .then(() => {
                    setNotification({ type: 'success', text: 'Equipment created successfully' });
                    navigate('/interfaces');
                })
                .catch((error) => {
                    console.error('Error creating equipment:', error);
                    setNotification({ type: 'error', text: 'Failed to create equipment' });
                });
        }
    }

    return (
        <>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h1 className="h4">{isEditing ? 'Edit Equipment' : 'New Equipment'}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card card-body border-0 shadow mb-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-2 mb-2">
                                        <label htmlFor="code">Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="code"
                                            name="code"
                                            value={equipment.code}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={equipment.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="brand">Brand</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="brand"
                                            name="brand"
                                            value={equipment.brand}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="model">Model</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="model"
                                            name="model"
                                            value={equipment.model}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                  
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="area">Area</label>
                                        <select
                                            className="form-control"
                                            id="area"
                                            name="area"
                                            value={equipment.area}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select</option>
                                            <option value="B2B">B2B</option>
                                            <option value="CARDIOLOGY">Cardiology</option>
                                            <option value="CLINICAL_BIOCHEMISTRY">Clinical Biochemistry</option>
                                            <option value="COAGULOGRAM">Coagulogram</option>
                                            <option value="CYTOLOGY">Cytology</option>
                                            <option value="DERMATOLOGY">Dermatology</option>
                                            <option value="ENDOCRINOLOGY">Endocrinology</option>
                                            <option value="GASTROENTEROLOGY">Gastroenterology</option>
                                            <option value="HEMATOLOGY">Hematology</option>
                                            <option value="HISTOPATHOLOGY_PATHOLOGY">Histopathology Pathology</option>
                                            <option value="IMMUNOLOGY">Immunology</option>
                                            <option value="MEDICAL_BIOPHYSICS">Medical Biophysics</option>
                                            <option value="MICROBIOLOGY">Microbiology</option>
                                            <option value="MOLECULAR_GENETICS">Molecular Genetics</option>
                                            <option value="NEUROLOGY">Neurology</option>
                                            <option value="ONCOLOGY">Oncology</option>
                                            <option value="OPHTHALMOLOGY">Ophthalmology</option>
                                            <option value="OTHERS">Others</option>
                                            <option value="PARASITOLOGY">Parasitology</option>
                                            <option value="SIGNALS">Signals</option>
                                            <option value="TUBE_SORTERS">Tube Sorters</option>
                                            <option value="TOXICOLOGY">Toxicology</option>
                                            <option value="URINALYSIS">Urinalysis</option>
                                            <option value="VIROLOGY">Virology</option>

                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="protocol">Protocol</label>
                                        <select
                                            className="form-control"
                                            id="protocol"
                                            name="protocol"
                                            value={equipment.protocol}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select</option>
                                            {["HL7", "ASTM", "OTHERS"].map(protocol => (
                                                <option key={protocol} value={protocol}>{protocol}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="testLevel">Test Level</label>
                                        <select
                                            className="form-control"
                                            id="testLevel"
                                            name="testLevel"
                                            value={equipment.testLevel}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select</option>
                                            {["1", "2", "3"].map(level => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="actualSetup">Actual Setup</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="actualSetup"
                                            name="actualSetup"
                                            value={equipment.actualSetup}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="active"
                                        name="active"
                                        checked={equipment.active}
                                        onChange={() => setEquipment(prevState => ({ ...prevState, active: !prevState.active }))}
                                    />
                                    <label className="form-check-label" htmlFor="active">Active</label>
                                </div>
                                <div className="row mt-4">
                                    <div className="col-sm-3">
                                        <button className="btn btn-primary mt-2" type="submit">
                                            {isEditing ? 'Update Equipment' : 'Create Equipment'}
                                        </button>
                                        <button
                                            className="btn btn-secondary mt-2 ms-2"
                                            type="button"
                                            onClick={() => navigate('/interfaces')}
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

export default InterfaceForm;
