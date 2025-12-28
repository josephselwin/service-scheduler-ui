import React, { useState } from 'react';
import { serviceSchedulerApi } from '../services/api';

const AppointmentForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        customerId: '',
        professionalId: '',
        serviceId: '',
        startDateTime: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await serviceSchedulerApi.createAppointment(formData);
            setSuccess('Appointment created successfully!');
            setFormData({
                customerId: '',
                professionalId: '',
                serviceId: '',
                startDateTime: '',
                notes: ''
            });
            if (onSuccess) setTimeout(onSuccess, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>New Appointment</h2>

            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px' }}>{error}</div>}
            {success && <div style={{ color: 'var(--success)', marginBottom: '1rem', padding: '0.75rem', background: '#dcfce7', borderRadius: '8px' }}>{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Customer ID</label>
                    <input
                        type="number"
                        name="customerId"
                        className="form-input"
                        value={formData.customerId}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 1"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Professional ID</label>
                    <input
                        type="number"
                        name="professionalId"
                        className="form-input"
                        value={formData.professionalId}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 101"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Service ID</label>
                    <input
                        type="number"
                        name="serviceId"
                        className="form-input"
                        value={formData.serviceId}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 5"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Start Date & Time</label>
                    <input
                        type="datetime-local"
                        name="startDateTime"
                        className="form-input"
                        value={formData.startDateTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea
                        name="notes"
                        className="form-input"
                        rows="3"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Optional notes..."
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Appointment'}
                </button>
            </form>
        </div>
    );
};

export default AppointmentForm;
