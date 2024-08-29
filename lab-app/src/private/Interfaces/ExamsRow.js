import React from 'react';

function ExamsRow({ data, onDelete, navigate }) {
    const { code, name, material, area } = data;

    // Formatando externalCodes para exibição
   // const formattedExternalCodes = externalCodes.map(ec => `${ec.system}: ${ec.code}`).join(', ');

    return (
        <tr>
            <td>{code}</td>
            <td>{name}</td>
            <td>{material}</td>
            <td>{area.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</td>
            <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/interfaces/edit/${code}`)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(code)}>Delete</button>
            </td>
        </tr>
    );
}

export default ExamsRow;
