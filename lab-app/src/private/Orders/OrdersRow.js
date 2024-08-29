import React from 'react';

function OrdersRow({ order, onDelete, navigate }) {
    return (
        <tr>
            <td>{order.name}</td>
            <td>{order.customer}</td>
            <td>{order.status}</td>
            <td>{order.date}</td>
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
