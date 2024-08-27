import React from 'react';

function EquipmentRow({ equipment, onDelete, navigate }) {
    return (
        <tr>
            <td>{equipment.name}</td>
            <td>{equipment.brand}</td>
            <td>{equipment.model}</td>
            <td>{equipment.code}</td>
            <td>{equipment.area}</td>
            <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/interfaces/edit/${equipment._id}`)}>Edit</button>
                <button className="btn btn-sm btn-danger me-2" onClick={() => onDelete(equipment._id)}>Delete</button>
                <button className="btn btn-sm btn-info" onClick={() => navigate(`/interfaces/view/${equipment._id}`)}>View</button>
            </td>
        </tr>
    );
}

export default EquipmentRow;
