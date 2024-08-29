import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createOne, updateOne, getOne } from '../../services/ExamsService';
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer/Footer';
import Toast from '../../components/Toast/Toast';
import ExamsRow from './ExternalCodeRow';

function ExamForm() {
    const [exam, setExam] = useState({
        name: '',
        area: '',
        material: '',
        code: '',
        externalCodes: [{ system: '', code: '' }],
    });
    const [currentCode, setCurrentCode] = useState({ system: '', code: '' });
    const [currentExternalCode, setCurrentExternalCode] = useState({ system: '', code: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState({});

    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            getOne(token, id)
                .then((data) => setExam(data))
                .catch((error) => {
                    console.error('Error fetching exam:', error);
                    setNotification({ type: 'error', text: 'Failed to load exam data' });
                });
        }
    }, [id, token]);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setExam(prevState => ({ ...prevState, [name]: value }));
    }

    // Funções para gerenciar subdocumentos 'code'
    function handleCodeChange(index, event) {
        const { name, value } = event.target;
        const updatedCodes = exam.code.map((item, i) => i === index ? { ...item, [name]: value } : item);
        setExam(prevState => ({ ...prevState, code: updatedCodes }));
    }

    function addCode() {
        setExam(prevState => ({
            ...prevState,
            code: [...prevState.code, currentCode]
        }));
        setCurrentCode({ system: '', code: '' });
    }

    function removeCode(index) {
        setExam(prevState => ({
            ...prevState,
            code: prevState.code.filter((_, i) => i !== index)
        }));
    }

    // Funções para gerenciar subdocumentos 'externalCodes'
    function handleExternalCodeChange(index, event) {
        const { name, value } = event.target;
        const updatedExternalCodes = exam.externalCodes.map((item, i) => i === index ? { ...item, [name]: value } : item);
        setExam(prevState => ({ ...prevState, externalCodes: updatedExternalCodes }));
    }

    function addExternalCode() {
        setExam(prevState => ({
            ...prevState,
            externalCodes: [...prevState.externalCodes, currentExternalCode]
        }));
        setCurrentExternalCode({ system: '', code: '' });
    }

    function removeExternalCode(index) {
        setExam(prevState => ({
            ...prevState,
            externalCodes: prevState.externalCodes.filter((_, i) => i !== index)
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (isEditing) {
            updateOne(token, id, exam)
                .then(() => {
                    setNotification({ type: 'success', text: 'Exam updated successfully' });
                    navigate('/exams');
                })
                .catch((error) => {
                    console.error('Error updating exam:', error);
                    setNotification({ type: 'error', text: 'Failed to update exam' });
                });
        } else {
            createOne(token, exam)
                .then(() => {
                    setNotification({ type: 'success', text: 'Exam created successfully' });
                    navigate('/exams');
                })
                .catch((error) => {
                    console.error('Error creating exam:', error);
                    setNotification({ type: 'error', text: 'Failed to create exam' });
                });
        }
    }

    return (
        <>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h1 className="h4">{isEditing ? 'Edit Exam' : 'New Exam'}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card card-body border-0 shadow mb-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                            <label htmlFor="code">Code</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="code"
                                                name="code"
                                                value={exam.code}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={exam.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="material">Material</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="material"
                                            name="material"
                                            value={exam.material}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="area">Area</label>
                                        <select
                                            className="form-control"
                                            id="area"
                                            name="area"
                                            value={exam.area}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select an Area</option>
                                            <option value="IMMUNOLOGY">Immunology</option>
                                            <option value="HEMATOLOGY">Hematology</option>
                                            <option value="CLINICAL_BIOCHEMISTRY">Clinical Biochemistry</option>
                                            <option value="MICROBIOLOGY">Microbiology</option>
                                            <option value="OPHTHALMOLOGY">Ophthalmology</option>
                                            {/* Adicione as demais áreas aqui */}
                                        </select>
                                    </div>
                                </div>

                                

                                

                                {/* Gerenciamento de External Codes */}
                                <div className="row mt-4">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="system">External System</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="system"
                                            name="system"
                                            value={currentExternalCode.system}
                                            onChange={(e) => setCurrentExternalCode({ ...currentExternalCode, system: e.target.value })}
                                            placeholder="External System"
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="code">External Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="code"
                                            name="code"
                                            value={currentExternalCode.code}
                                            onChange={(e) => setCurrentExternalCode({ ...currentExternalCode, code: e.target.value })}
                                            placeholder="External Code"
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <button type="button" className="btn btn-secondary mt-4" onClick={addExternalCode}>Add External Code</button>
                                    </div>
                                </div>

                                {/* Lista de External Codes */}
                                <div className="row">
                                    <div className="col-12">
                                        <ul className="list-group">
                                            {exam.externalCodes.map((externalCodeItem, index) => (
                                                <ExamsRow
                                                    key={index}
                                                    codeItem={externalCodeItem}
                                                    index={index}
                                                    handleCodeChange={handleExternalCodeChange}
                                                    removeCode={removeExternalCode}
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Botões de Envio */}
                                <div className="row mt-4">
                                    <div className="col-sm-3">
                                        <button className="btn btn-primary mt-2" type="submit">
                                            {isEditing ? 'Update Exam' : 'Create Exam'}
                                        </button>
                                        <button
                                            className="btn btn-secondary mt-2 ms-2"
                                            type="button"
                                            onClick={() => navigate('/exams')}
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

export default ExamForm;
