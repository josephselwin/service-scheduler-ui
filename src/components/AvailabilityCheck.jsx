import React, { useState } from 'react';
import { serviceSchedulerApi } from '../services/api';

const AvailabilityCheck = () => {
    const [formData, setFormData] = useState({
        professionalId: '',
        start: '',
        end: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheck = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await serviceSchedulerApi.checkAvailability(
                formData.professionalId,
                formData.start,
                formData.end
            );
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to check availability');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Check Availability</h2>

            <form onSubmit={handleCheck} style={{ marginBottom: '2rem' }}>
                <div className="form-group">
                    <label className="form-label">Professional ID</label>
                    <input
                        type="number"
                        name="professionalId"
                        className="form-input"
                        value={formData.professionalId}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Start Time</label>
                        <input
                            type="datetime-local"
                            name="start"
                            className="form-input"
                            value={formData.start}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">End Time</label>
                        <input
                            type="datetime-local"
                            name="end"
                            className="form-input"
                            value={formData.end}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Checking...' : 'Check Availability'}
                </button>
            </form>

            {error && <div style={{ color: 'var(--danger)', padding: '1rem', background: '#fee2e2', borderRadius: '8px', textAlign: 'center' }}>{error}</div>}

            {result && (
                <div style={{ padding: '1.5rem', background: result.IsAvailable ? '#dcfce7' : '#fee2e2', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: result.IsAvailable ? 'var(--success)' : 'var(--danger)' }}>
                        {result.IsAvailable ? 'Available' : 'Not Available'}
                    </h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                        {result.Message || (result.IsAvailable ? 'The professional is free at this time.' : 'The professional has conflicts.')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AvailabilityCheck;
