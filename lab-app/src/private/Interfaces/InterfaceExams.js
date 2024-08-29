import React from 'react';
import SelectExams from '../../components/SelectExams/SelectExams';
import { getLocalExams } from '../../services/LocalServices';


function InterfaceExams({ index, exam, removeExam }) {
    const examName = getLocalExams().find(e => e.id === exam.code);
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex w-75">
                <input
                    type="text"
                    className="form-control me-2"
                    name="code"
                    value={examName.name}
                    disabled
                />
               
                 <input
                    type="text"
                    className="form-control me-2"
                    name="test"
                    value={exam.test}
                    disabled
                />
                <input
                    type="text"
                    className="form-control me-2"
                    name="material"
                    value={exam.material}
                    disabled
                />
                 <input
                    type="text"
                    className="form-control me-2"
                    name="method"
                    value={exam.method}
                    disabled
                />
            </div>
            <button type="button" className="btn btn-danger btn-sm ms-2" onClick={() => removeExam(index)}>Remove</button>
        </li>
    );
}

export default InterfaceExams;
