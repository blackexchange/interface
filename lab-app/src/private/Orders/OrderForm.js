import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createOne, updateOne, getOne } from '../../services/OrdersService';
import SelectPatient from '../../components/SelectPatient/SelectPatient';
import ExamSelector from '../../components/ExamSelector/ExamSelector';
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer/Footer';
import Toast from '../../components/Toast/Toast';

function OrderForm({ examsList }) {
    const [order, setOrder] = useState({
        patient: null,
        barCode: '',
        material: '',
        exams: [],
        status: 'PENDENT',
        urgent: false,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            getOne(token, id)
                .then((data) => setOrder(data))
                .catch((error) => {
                    console.error('Error fetching order:', error);
                    setNotification({ type: 'error', text: 'Failed to load order data' });
                });
        }
    }, [id, token]);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setOrder(prevState => ({ ...prevState, [name]: value }));
    }

    function handlePatientSelect(patient) {
        setOrder(prevState => ({ ...prevState, patient }));
    }

    function handleAddExam(exam) {
        if (!order.exams.some(e => e._id === exam._id)) {
            setOrder(prevState => ({
                ...prevState,
                exams: [...prevState.exams, exam],
            }));
        }
    }

    function handleRemoveExam(index) {
        setOrder(prevState => ({
            ...prevState,
            exams: prevState.exams.filter((_, i) => i !== index),
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (isEditing) {
            updateOne(token, id, order)
                .then(() => {
                    setNotification({ type: 'success', text: 'Order updated successfully' });
                    navigate('/orders');
                })
                .catch((error) => {
                    console.error('Error updating order:', error);
                    setNotification({ type: 'error', text: 'Failed to update order' });
                });
        } else {
            createOne(token, order)
                .then(() => {
                    setNotification({ type: 'success', text: 'Order created successfully' });
                    navigate('/orders');
                })
                .catch((error) => {
                    console.error('Error creating order:', error);
                    setNotification({ type: 'error', text: 'Failed to create order' });
                });
        }
    }

    return (
        <>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h1 className="h4">{isEditing ? 'Edit Order' : 'New Order'}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card card-body border-0 shadow mb-4">
                            <form onSubmit={handleSubmit}>
                                <SelectPatient token={token} onSelectPatient={handlePatientSelect} />

                                <div className="mb-3">
                                    <label htmlFor="barCode">Bar Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="barCode"
                                        name="barCode"
                                        value={order.barCode}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="material">Material</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="material"
                                        name="material"
                                        value={order.material}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <ExamSelector
                                    examsList={order.exams}
                                    onAddExam={handleAddExam}
                                />

                                {order.exams.length > 0 && (
                                    <div className="mb-3">
                                        <h5>Selected Exams</h5>
                                        <ul className="list-group">
                                            {order.exams.map((exam, index) => (
                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                    {exam.name} - {exam.code}
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-danger btn-sm" 
                                                        onClick={() => handleRemoveExam(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="status">Status</label>
                                    <select
                                        className="form-control"
                                        id="status"
                                        name="status"
                                        value={order.status}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="PENDENT">PENDENT</option>
                                        <option value="WAITING">WAITING</option>
                                        <option value="PROCESSING">PROCESSING</option>
                                        <option value="DONE">DONE</option>
                                    </select>
                                </div>

                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="urgent"
                                        name="urgent"
                                        checked={order.urgent}
                                        onChange={() => setOrder(prevState => ({ ...prevState, urgent: !prevState.urgent }))}
                                    />
                                    <label className="form-check-label" htmlFor="urgent">Urgent</label>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-sm-3">
                                        <button className="btn btn-primary mt-2" type="submit">
                                            {isEditing ? 'Update Order' : 'Create Order'}
                                        </button>
                                        <button
                                            className="btn btn-secondary mt-2 ms-2"
                                            type="button"
                                            onClick={() => navigate('/orders')}
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

export default OrderForm;
