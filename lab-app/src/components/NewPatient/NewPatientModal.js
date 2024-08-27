import React, { useState, useEffect } from 'react';

function NewPatientModal({ patient, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        document: '',
        gender: ''
    });

    useEffect(() => {
        if (patient) {
            setFormData({
                name: patient.name || '',
                dateOfBirth: patient.dateOfBirth || '',
                document: patient.document || '',
                gender: patient.gender || ''
            });
        }
    }, [patient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{patient ? 'Edit Patient' : 'New Patient'}</h5>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Date Of Birth</label>
                                <input type="date" className="form-control" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Document</label>
                                <input type="text" className="form-control" name="document" value={formData.document} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select className="form-control" name="gender" value={formData.gender} onChange={handleChange} required>
                                    <option value="">Select...</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewPatientModal;
