import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer/Footer';
import Toast from '../../components/Toast/Toast';
import ExamsRow from './ExamsRow';
import { getAll,deleteOne } from '../../services/ExamsService';



function Exams() {
    const [data, setData] = useState([]);
    const [notification, setNotification] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchAll();
    }, []);

    function fetchAll() {
        getAll(token)
            .then((data) => setData(data))
            .catch((error) => {
                console.error('Error fetching data:', error);
                setNotification({ type: 'error', text: 'Failed to load data' });
            });
    }

    function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this data?')) {
            deleteOne(token, id)
                .then(() => {
                    setNotification({ type: 'success', text: 'Data deleted successfully' });
                    fetchAll(); // Reload the list after deletion
                })
                .catch((error) => {
                    console.error('Error deleting data:', error);
                    setNotification({ type: 'error', text: 'Failed to delete data' });
                });
        }
    }

    return (
        <>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h1 className="h4">Exams</h1>
                    </div>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <button className="btn btn-primary" onClick={() => navigate('/exams/new')}>
                            New Exam
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
                                            <th className="border-bottom" scope="col">Code</th>
                                            <th className="border-bottom" scope="col">Name</th>
                                            <th className="border-bottom" scope="col">Material</th>
                                            <th className="border-bottom" scope="col">External Codes</th>
                                            <th className="border-bottom" scope="col">Area</th>
                                            <th className="border-bottom" scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.length > 0 ? (
                                                data.map(row => (
                                                    <ExamsRow
                                                        key={row._id}
                                                        data={row}
                                                        onDelete={handleDelete}
                                                        navigate={navigate}
                                                    />
                                                ))
                                            ) : (
                                                <tr><td colSpan="6" className="text-center">No data found</td></tr>
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

export default Exams;
