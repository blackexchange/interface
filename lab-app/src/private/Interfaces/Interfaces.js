import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer/Footer';
import Toast from '../../components/Toast/Toast';
import InterfacesRow from './InterfacesRow';
import { getEquipments, deleteEquipment } from '../../services/InterfacesService';


function Interfaces() {
    const [equipments, setEquipments] = useState([]);
    const [notification, setNotification] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchEquipments();
    }, []);

    function fetchEquipments() {
        getEquipments(token)
            .then((data) => setEquipments(data))
            .catch((error) => {
                console.error('Error fetching equipments:', error);
                setNotification({ type: 'error', text: 'Failed to load equipments' });
            });
    }

    function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this equipment?')) {
            deleteEquipment(token, id)
                .then(() => {
                    setNotification({ type: 'success', text: 'Equipment deleted successfully' });
                    fetchEquipments(); // Reload the list after deletion
                })
                .catch((error) => {
                    console.error('Error deleting equipment:', error);
                    setNotification({ type: 'error', text: 'Failed to delete equipment' });
                });
        }
    }

    return (
        <>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h1 className="h4">Interfaces</h1>
                    </div>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <button className="btn btn-primary" onClick={() => navigate('/interfaces/new')}>
                            New Interface
                        </button>
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
                                            <th className="border-bottom" scope="col">Brand</th>
                                            <th className="border-bottom" scope="col">Model</th>
                                            <th className="border-bottom" scope="col">Code</th>
                                            <th className="border-bottom" scope="col">Area</th>
                                            <th className="border-bottom" scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            equipments.length > 0 ? (
                                                equipments.map(equipment => (
                                                    <InterfacesRow
                                                        key={equipment._id}
                                                        equipment={equipment}
                                                        onDelete={handleDelete}
                                                        navigate={navigate}
                                                    />
                                                ))
                                            ) : (
                                                <tr><td colSpan="6" className="text-center">No equipments found</td></tr>
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

export default Interfaces;
