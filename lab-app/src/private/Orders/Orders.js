import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer/Footer';
import Toast from '../../components/Toast/Toast';
import OrderRow from './OrdersRow';
import { getAll, deleteOne } from '../../services/OrdersService';

function Order() {
    const [orders, setOrders] = useState([]);
    const [notification, setNotification] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchOrders();
    }, []);

    function fetchOrders() {
        getAll(token)
            .then((data) => setOrders(data))
            .catch((error) => {
                console.error('Error fetching orders:', error);
                setNotification({ type: 'error', text: 'Failed to load orders' });
            });
    }

    function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this order?')) {
            deleteOne(token, id)
                .then(() => {
                    setNotification({ type: 'success', text: 'Order deleted successfully' });
                    fetchOrders(); // Reload the list after deletion
                })
                .catch((error) => {
                    console.error('Error deleting order:', error);
                    setNotification({ type: 'error', text: 'Failed to delete order' });
                });
        }
    }

    return (
        <>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h1 className="h4">Orders</h1>
                    </div>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <button className="btn btn-primary" onClick={() => navigate('/orders/new')}>
                            New Order
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
                                            <th className="border-bottom" scope="col">Patient</th>
                                            <th className="border-bottom" scope="col">Date</th>
                                            <th className="border-bottom" scope="col">Exams</th>
                                            <th className="border-bottom" scope="col">Status</th>
                                            <th className="border-bottom" scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            orders.length > 0 ? (
                                                orders.map(order => (
                                                    <OrderRow
                                                        key={order._id}
                                                        order={order}
                                                        onDelete={handleDelete}
                                                        navigate={navigate}
                                                    />
                                                ))
                                            ) : (
                                                <tr><td colSpan="5" className="text-center">No orders found</td></tr>
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

export default Order;
