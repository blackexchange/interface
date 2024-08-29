import React, { useState, useEffect } from 'react';
import { getLocalExams } from '../../services/LocalServices';

function ExamSelector({ onAddExam, examsList }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredExams, setFilteredExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);

    useEffect(() => {
        const localExams = getLocalExams(); // Função que retorna os exames armazenados localmente
        setFilteredExams(localExams);
    }, []);

    useEffect(() => {
        if (searchTerm.trim()) {
            const localExams = getLocalExams(); // Sempre busca a lista completa
            const filtered = localExams.filter(exam =>
                exam.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredExams(filtered);
        } else {
            setFilteredExams([]); // Limpa a lista de exames se não houver busca
        }
    }, [searchTerm]);

    function handleAddExam() {
        if (selectedExam && !examsList.some(e => e._id === selectedExam._id)) {
            onAddExam(selectedExam);
            setSelectedExam(null); // Limpa o exame selecionado após adicionar
            setSearchTerm(''); // Limpa o campo de busca após adicionar
        }
    }

    function handleExamSelect(exam) {
        setSelectedExam(exam);
        setSearchTerm(exam.name); // Atualiza o campo de entrada com o nome do exame selecionado
        setFilteredExams([]); // Limpa a lista de resultados para evitar seleção duplicada
    }

    return (
        <div className="mb-4">
            <input
                type="text"
                className="form-control mb-2"
                placeholder="Search for an exam"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredExams.length > 0 && (
                <ul className="list-group">
                    {filteredExams.map(exam => (
                        <li
                            key={exam._id}
                            className="list-group-item"
                            onClick={() => handleExamSelect(exam)}
                            style={{ cursor: 'pointer' }}
                        >
                            {exam.name}
                        </li>
                    ))}
                </ul>
            )}
            <button
                type="button"
                className="btn btn-secondary mt-2"
                onClick={handleAddExam}
                disabled={!selectedExam}
            >
                Add Exam
            </button>
        </div>
    );
}

export default ExamSelector;
