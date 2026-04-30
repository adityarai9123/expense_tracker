import axios from 'axios';

// In production (Vercel), backend is at /_/backend
// In development, use the env variable or localhost:5000
const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (import.meta.env.PROD) {
    return '/_/backend';
  }
  return 'http://localhost:5000';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Something went wrong. Please try again.';

    if (error.code === 'ECONNABORTED') {
      message = 'Request timed out. Please check your connection.';
    } else if (!error.response) {
      message = 'Cannot reach the server. Is it running?';
    } else {
      const data = error.response.data;
      if (data?.errors && Array.isArray(data.errors)) {
        message = data.errors.join(' · ');
      } else if (data?.error) {
        message = data.error;
      } else if (data?.message) {
        message = data.message;
      }
    }

    return Promise.reject(new Error(message));
  }
);

/** Create a new expense */
export const createExpense = async (payload) => {
  const response = await api.post('/expenses', payload);
  return response.data;
};

/** Fetch expenses with optional filtering/sorting */
export const getExpenses = async (params = {}) => {
  const response = await api.get('/expenses', { params });
  return response.data;
};

/** Update an expense */
export const updateExpense = async (id, payload) => {
  const response = await api.put(`/expenses/${id}`, payload);
  return response.data;
};

/** Delete an expense */
export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

export default api;
