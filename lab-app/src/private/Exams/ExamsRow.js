import React from 'react';

function ExamsRow({ data, onDelete, navigate }) {
    const { _id, code, name, material, externalCodes, area } = data;

    // Formatando externalCodes para exibição
    const formattedExternalCodes = externalCodes.map(ec => `${ec.system}: ${ec.code}`).join(', ');

    return (
        <tr>
            <td>{code}</td>
            <td>{name}</td>
            <td>{material}</td>
            <td>{formattedExternalCodes}</td>
            <td>{area.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</td>
            <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/exams/edit/${_id}`)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(_id)}>Delete</button>
            </td>
        </tr>
    );
}

export default ExamsRow;
