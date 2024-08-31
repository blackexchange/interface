import React from 'react';
import moment from 'moment';

function OrdersRow({ order, onDelete, navigate }) {
    return (
        <tr>
            <td>{order.patient.name}</td>
            <td>{moment(order.createdAt).format('DD/MM/YYYY')}</td>
            <td>{order.exams.map(exam => exam.code).join(', ')}</td>
            <td>{order.status}</td>
            <td>
                <button 
                    className="btn btn-sm btn-warning me-2" 
                    onClick={() => navigate(`/orders/edit/${order._id}`)}
                >
                    Edit
                </button>
                <button 
                    className="btn btn-sm btn-danger me-2" 
                    onClick={() => onDelete(order._id)}
                >
                    Delete
                </button>
                <button 
                    className="btn btn-sm btn-info" 
                    onClick={() => navigate(`/orders/view/${order._id}`)}
                >
                    View
                </button>
            </td>
        </tr>
    );
}

export default OrdersRow;
