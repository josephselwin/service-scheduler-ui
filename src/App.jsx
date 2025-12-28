import React, { useState } from 'react';
import AppointmentForm from './components/AppointmentForm';
import ScheduleView from './components/ScheduleView';
import AvailabilityCheck from './components/AvailabilityCheck';

function App() {
    const [activeTab, setActiveTab] = useState('schedule');

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>Service Scheduler</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Manage appointments efficiently</p>
            </header>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                <button
                    className={`btn ${activeTab === 'schedule' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab !== 'schedule' ? 'white' : undefined, border: activeTab !== 'schedule' ? '1px solid var(--border-color)' : undefined }}
                    onClick={() => setActiveTab('schedule')}
                >
                    View Schedule
                </button>
                <button
                    className={`btn ${activeTab === 'create' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab !== 'create' ? 'white' : undefined, border: activeTab !== 'create' ? '1px solid var(--border-color)' : undefined }}
                    onClick={() => setActiveTab('create')}
                >
                    New Appointment
                </button>
                <button
                    className={`btn ${activeTab === 'check' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab !== 'check' ? 'white' : undefined, border: activeTab !== 'check' ? '1px solid var(--border-color)' : undefined }}
                    onClick={() => setActiveTab('check')}
                >
                    Check Availability
                </button>
            </div>

            <main>
                {activeTab === 'schedule' && <ScheduleView />}
                {activeTab === 'create' && <AppointmentForm onSuccess={() => setActiveTab('schedule')} />}
                {activeTab === 'check' && <AvailabilityCheck />}
            </main>
        </div>
    );
}

export default App;
