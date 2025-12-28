import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://service-scheduler-api-7132.azurewebsites.net';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const serviceSchedulerApi = {
    // 1. Create Appointment
    createAppointment: async (data) => {
        return api.post('/api/appointments', data);
    },

    // 2. Update Appointment Status
    updateAppointmentStatus: async (id, status) => {
        return api.patch(`/api/appointments/${id}/status`, { status });
    },

    // 3. Cancel Appointment
    cancelAppointment: async (id) => {
        return api.post(`/api/appointments/${id}/cancel`);
    },

    // 4. Check Availability
    checkAvailability: async (professionalId, start, end) => {
        return api.get('/api/availability/check', {
            params: { professionalId, start, end }
        });
    },

    // 5. Get Service Professional Schedule
    getProfessionalSchedule: async (professionalId, from, to) => {
        return api.get(`/api/professionals/${professionalId}/schedule`, {
            params: { from, to }
        });
    }
};
