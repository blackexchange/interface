import React, { useState, useEffect, useRef } from 'react';
import { getLocalExams } from '../../services/LocalServices';


function SelectExams(props) {
    const [exams, setExams] = useState([{ id: "loading", name: "LOADING" }]);
    const selectRef = useRef(null);

    useEffect(() => {
        const storedExams = getLocalExams();

        if (getLocalExams) {
            setExams(storedExams);
        } else {
            setExams([{ id: "no_exams", name: "NO EXAMS" }]);
        }
       
    }, []); // Executa apenas na montagem do componente

    useEffect(() => {
        if (props.examCode && selectRef.current.value !== props.examCode) {
            selectRef.current.value = props.examCode;
        }
    }, [props.examCode]);

    function onExamChange(event) {
        const selectedValue = event.target.value;
        props.onChange({ target: { id: 'examCode', value: selectedValue } });
    }

    return (
        
        <div >
            <label htmlFor="examCode">Exam</label>
            <select 
                ref={selectRef} 
                id="examCode" 
                name="examCode" 
                className="form-control" 
                onChange={onExamChange}
                disabled={props.disabled}
            >
                <option value="">Select...</option>
                {exams.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                ))}
            </select>
        </div>
    );
}

export default SelectExams;
