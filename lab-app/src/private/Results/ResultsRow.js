import React from 'react';

function ResultsRow({ data, onDelete, navigate }) {
    const { _id, barCode, results, createdAt, device } = data;
    // Formatando externalCodes para exibição
    const testsValues = results.map(ec => `${ec.test}: ${ec.value}`).join(', ');

    return (
        <tr>
            <td>{barCode}</td>
            <td>{device.deviceId}</td>
            <td>{testsValues}</td>
            <td>{createdAt}</td>
            <td></td>
            <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/exams/edit/${_id}`)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(_id)}>Delete</button>
            </td>
        </tr>
    );
}

export default ResultsRow;
