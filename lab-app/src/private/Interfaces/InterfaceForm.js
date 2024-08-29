import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEquipment, updateEquipment, getEquipmentById } from '../../services/InterfacesService';
import Menu from '../../components/Menu/Menu';
import SelectExams from '../../components/SelectExams/SelectExams';
import Footer from '../../components/Footer/Footer';
import Toast from '../../components/Toast/Toast';
import InterfaceExams from './InterfaceExams';
import { getAreas } from '../../services/LocalServices';


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

    const [currentExam, setCurrentExam] = useState({ code: '', test:'', param:'', material: '', method:'' });
    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState({});

    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const listArea = getAreas();

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            getEquipmentById(token, id)
                .then((data) => {
                    if (data) {
                        setEquipment(data);
                    } else {
                        setNotification({ type: 'error', text: 'No data found for the specified equipment.' });
                    }
                })
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

    function handleExamChange(index, event) {
        const { name, value } = event.target;
        const updatedExams = equipment.exams.map((exam, i) => 
            i === index ? { ...exam, [name]: value } : exam
        );
        setEquipment(prevState => ({ ...prevState, exams: updatedExams }));
        
    }


    function addExam() {
        
        if (!currentExam.code || !currentExam.material || !currentExam.test || !currentExam.param || !currentExam.method) {
            setNotification({ type: 'error', text: 'Please select an exam and provide material.' });
            return;
        }

        setEquipment(prevState => ({
            ...prevState,
            exams: [...prevState.exams, currentExam],
        }));


        setCurrentExam({ code: '', material: '' });
    }

    function removeExam(index) {
        setEquipment(prevState => ({
            ...prevState,
            exams: prevState.exams.filter((_, i) => i !== index),
        }));
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
                                {/* Campos do formulário como nome, marca, modelo, etc. */}
                                <div className="row">
                                    {/* Código, Nome, Marca, Modelo */}
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
                                {/* Area, Protocol, Test Level */}
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
                                             {listArea.map((item, index) => (
                                                <option key={index} value={item.value}>
                                                    {item.name}
                                                </option>
                                            ))}
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
                                    {/* Campos adicionais */}
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
                                <hr />

                                {/* Seleção e Adição de Exames */}
                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <SelectExams 
                                            examCode={currentExam.code}
                                            onChange={(e) => setCurrentExam({ ...currentExam, code: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="test">Test</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="test"
                                            name="test"
                                            value={currentExam.test}
                                            onChange={(e) => setCurrentExam({ ...currentExam, test: e.target.value })}
                                            placeholder="Test"
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="param">Param</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="param"
                                            name="param"
                                            value={currentExam.param}
                                            onChange={(e) => setCurrentExam({ ...currentExam, param: e.target.value })}
                                            placeholder="Param"
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="material">Material</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="material"
                                            name="material"
                                            value={currentExam.material}
                                            onChange={(e) => setCurrentExam({ ...currentExam, material: e.target.value })}
                                            placeholder="Material"
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="method">Method</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="method"
                                            name="method"
                                            value={currentExam.method}
                                            onChange={(e) => setCurrentExam({ ...currentExam, method: e.target.value })}
                                            placeholder="Method"
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <button type="button" className="btn btn-secondary mt-4" onClick={addExam}>Add Exam</button>
                                    </div>
                                </div>

                                {/* Renderização da Lista de Exames */}
                                <div className="row">
                                    <div className="col-12">
                                        <ul className="list-group">
                                            {equipment.exams.map((exam, index) => (
                                                <InterfaceExams
                                                    key={index}
                                                    exam={exam}
                                                    index={index}
                                                    removeExam={removeExam}
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                            
                               

                                {/* Botões de ação */}
                                <div className="row mt-4">
                                    <div className="col-sm-6">
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
