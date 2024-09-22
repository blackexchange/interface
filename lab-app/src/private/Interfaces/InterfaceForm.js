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
        exams: [],
        devices:[],
        actualSetup:'',
        active: false
    });

    const [currentDevice, setCurrentDevice] = useState({
        deviceId: '',
        ip: '127.0.0.1',
        port: '',
        role: 'client',
        mode: 'TCP',
        protocol: 'HL7',
        status: 'active'
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

    function addDevice() {
        if (!currentDevice.deviceId || !currentDevice.ip || !currentDevice.port) {
            setNotification({ type: 'error', text: 'Please provide valid device details.' });
            return;
        }
        setEquipment(prevState => ({
            ...prevState,
            devices: [...prevState.devices, currentDevice]
        }));
        setCurrentDevice({
            deviceId: '',
            ip: '',
            port: '',
            role: '',
            mode: '',
            protocol: '',
            status: 'active'
        });
    }

    function removeDevice(index) {
        setEquipment(prevState => ({
            ...prevState,
            devices: prevState.devices.filter((_, i) => i !== index)
        }));
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
        setEquipment(prevState => ({ ...prevState, [name]: value }));
    }

   
    function handleDeviceChange(event) {
        const { name, value } = event.target;
        setCurrentDevice(prevState => ({ ...prevState, [name]: value }));
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
                                    <div className="col-md-3 mb-3">
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
                                    <div className="col-md- mb-3">
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
                                    {/* Campos adicionais */}
                                  
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
                                <hr />

                                <h5>Devices</h5>
                                <div className="row">
                                    <div className="col-md-2 mb-3">
                                        <label htmlFor="deviceId">Device ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="deviceId"
                                            name="deviceId"
                                            value={currentDevice.deviceId}
                                            onChange={handleDeviceChange}
                                            
                                        />
                                    </div>
                                    <div className="col-md-2 mb-3">
                                        <label htmlFor="ip">IP Address</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="ip"
                                            name="ip"
                                            value={currentDevice.ip}
                                            onChange={handleDeviceChange}
                                            
                                        />
                                    </div>
                                    <div className="col-md-2 mb-3">
                                        <label htmlFor="port">Port</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="port"
                                            name="port"
                                            value={currentDevice.port}
                                            onChange={handleDeviceChange}
                                            
                                        />
                                    </div>
                                    <div className="col-md-2 mb-3">
                                        <label htmlFor="role">Role</label>
                                        <select
                                            className="form-control"
                                            id="role"
                                            name="role"
                                            value={currentDevice.role}
                                            onChange={handleDeviceChange}
                                        >
                                            <option value="client">Client</option>
                                            <option value="server">Server</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2 mb-3">
                                        <label htmlFor="mode">Mode</label>
                                        <select
                                            className="form-control"
                                            id="mode"
                                            name="mode"
                                            value={currentDevice.mode}
                                            onChange={handleDeviceChange}
                                        >
                                            <option value="TCP">TCP</option>
                                            <option value="SERIAL">Serial</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2 mb-3">
                                        <label htmlFor="protocol">Protocol</label>
                                        <select
                                            className="form-control"
                                            id="protocol"
                                            name="protocol"
                                            value={currentDevice.protocol}
                                            onChange={handleDeviceChange}
                                        >
                                            <option value="HL7">HL7</option>
                                            <option value="ASTM">ASTM</option>
                                            <option value="OTHERS">OTHERS</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2 mb-3">
                                        <label htmlFor="status">Status</label>
                                        <select
                                            className="form-control"
                                            id="status"
                                            name="status"
                                            value={currentDevice.status}
                                            onChange={handleDeviceChange}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <button type="button" className="btn btn-secondary mt-4" onClick={addDevice}>Add Device</button>
                                    </div>
                                </div>

                                {/* Render the list of devices */}
                                <ul className="list-group">
                                    {equipment.devices.map((device, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            {device.deviceId} ({device.ip}:{device.port})
                                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeDevice(index)}>Remove</button>
                                        </li>
                                    ))}
                                </ul>
                            
                               

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
