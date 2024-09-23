import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer/Footer';
import Toast from '../../components/Toast/Toast';
import { getAll } from '../../services/ResultsServices';
import { getActiveDevices } from '../../services/InterfacesService'; // Serviço para buscar dispositivos
import ResultsRow from './ResultsRow';

function Results() {
    const [data, setData] = useState([]);
    const [devices, setDevices] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        barcode: '',
        device: '',
    });
    const [notification, setNotification] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchAll();
        fetchDevices();
    }, []);

    function fetchAll() {
        // Adicione os filtros nos parâmetros da chamada ao backend
        const query = {
            startDate: filters.startDate,
            endDate: filters.endDate,
            barcode: filters.barcode,
            device: filters.device,
        };

        getAll(token, query)
            .then((data) => setData(data))
            .catch((error) => {
                console.error('Error fetching data:', error);
                setNotification({ type: 'error', text: 'Failed to load data' });
            });
    }

    function fetchDevices() {
        getActiveDevices()
            .then((devices) => setDevices(devices))
            .catch((error) => {
                console.error('Error fetching devices:', error);
                setNotification({ type: 'error', text: 'Failed to load devices' });
            });
    }

    function handleFilterChange(e) {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    }

    function handleSearch() {
        fetchAll();
    }

    return (
        <>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h1 className="h4">Results</h1>
                    </div>
                    
                </div>

                {/* Filtros de Pesquisa */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            className="form-control"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            className="form-control"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="barcode">Barcode</label>
                        <input
                            type="text"
                            id="barcode"
                            name="barcode"
                            className="form-control"
                            value={filters.barcode}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="device">Device</label>
                        <select
                            id="device"
                            name="device"
                            className="form-control"
                            value={filters.device}
                            onChange={handleFilterChange}
                        >
                            <option value="">Select Device</option>
                            {devices.map((device) => (
                                <option key={device._id} value={device.deviceId}>
                                    {device.deviceId}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button className="btn btn-secondary mb-3" onClick={handleSearch}>
                    Search
                </button>

                {/* Tabela de Resultados */}
                <div className="row">
                    <div className="col-12">
                        <div className="card card-body border-0 shadow mb-4">
                            <div className="table-responsive divScroll">
                                <table className="table align-items-center table-flush table-sm table-hover tableFixHead">
                                    <thead className="thead-light">
                                        <tr>
                                            <th className="border-bottom" scope="col">Bar Code</th>
                                            <th className="border-bottom" scope="col">Device</th>
                                            <th className="border-bottom" scope="col">Results</th>
                                            <th className="border-bottom" scope="col">Date</th>
                                            <th className="border-bottom" scope="col">Area</th>
                                            <th className="border-bottom" scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length > 0 ? (
                                            data.map(row => (
                                                <ResultsRow
                                                    key={row._id}
                                                    data={row}
                                                    onDelete={null}
                                                    navigate={navigate}
                                                />
                                            ))
                                        ) : (
                                            <tr><td colSpan="6" className="text-center">No data found</td></tr>
                                        )}
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

export default Results;
