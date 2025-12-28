import React, { useState } from 'react';
import { serviceSchedulerApi } from '../services/api';

const ScheduleView = () => {
    const [filter, setFilter] = useState({
        professionalId: '',
        from: '',
        to: ''
    });
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setHasSearched(true);

        try {
            const response = await serviceSchedulerApi.getProfessionalSchedule(
                filter.professionalId,
                filter.from,
                filter.to
            );
            setAppointments(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch schedule');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await serviceSchedulerApi.updateAppointmentStatus(id, newStatus);
            // Refresh list locally
            setAppointments(prev => prev.map(apt =>
                apt.Id === id ? { ...apt, Status: newStatus } : apt
            ));
        } catch (err) {
            alert('Failed to update status: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await serviceSchedulerApi.cancelAppointment(id);
            // Remove from list or mark simplified
            setAppointments(prev => prev.filter(apt => apt.Id !== id));
        } catch (err) {
            alert('Failed to cancel appointment: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>View Schedule</h2>
                <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Professional ID</label>
                        <input
                            type="number"
                            className="form-input"
                            value={filter.professionalId}
                            onChange={e => setFilter({ ...filter, professionalId: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">From</label>
                        <input
                            type="datetime-local"
                            className="form-input"
                            value={filter.from}
                            onChange={e => setFilter({ ...filter, from: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">To</label>
                        <input
                            type="datetime-local"
                            className="form-input"
                            value={filter.to}
                            onChange={e => setFilter({ ...filter, to: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: '42px', marginBottom: '1px' }}>
                        {loading ? 'Loading...' : 'Fetch Schedule'}
                    </button>
                </form>
            </div>

            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

            {hasSearched && appointments.length === 0 && !loading && !error && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No appointments found for this period.
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {appointments.map(apt => (
                    <div key={apt.Id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                {new Date(apt.StartDateTime).toLocaleString()}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                Service ID: {apt.ServiceId} • Customer ID: {apt.CustomerId}
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    background: apt.Status === 'Confirmed' ? '#dcfce7' : '#f1f5f9',
                                    color: apt.Status === 'Confirmed' ? '#166534' : '#475569'
                                }}>
                                    {apt.Status || 'Scheduled'}
                                </span>
                            </div>
                            {apt.Notes && <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{apt.Notes}"</div>}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                                className="form-input"
                                style={{ width: 'auto', padding: '0.4rem' }}
                                value={apt.Status || ''}
                                onChange={(e) => handleStatusUpdate(apt.Id, e.target.value)}
                            >
                                <option value="">Actions...</option>
                                <option value="Confirmed">Confirm</option>
                                <option value="Completed">Complete</option>
                                <option value="NoShow">No Show</option>
                            </select>
                            <button onClick={() => handleCancel(apt.Id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleView;
