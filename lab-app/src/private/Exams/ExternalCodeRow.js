import React from 'react';

function ExternalCodeRow({ codeItem, index, handleCodeChange, removeCode }) {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex w-50">
                <input
                    type="text"
                    className="form-control me-2"
                    name="system"
                    value={codeItem.system}
                    onChange={(e) => handleCodeChange(index, e)}
                    placeholder="System"
                />
                <input
                    type="text"
                    className="form-control"
                    name="code"
                    value={codeItem.code}
                    onChange={(e) => handleCodeChange(index, e)}
                    placeholder="Code"
                />
            </div>
            <button type="button" className="btn btn-danger btn-sm ms-2" onClick={() => removeCode(index)}>Remove</button>
        </li>

    );
}

export default ExternalCodeRow;
