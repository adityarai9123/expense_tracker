import axios from 'axios';

// Centralized Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 12000, // 12s timeout — handles slow networks
  headers: {
    'Content-Type': 'application/json',
  },
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

/**
 * Create a new expense
 * @param {Object} payload - { amount, category, description, date, idempotencyKey }
 */
export const createExpense = async (payload) => {
  const response = await api.post('/expenses', payload);
  return response.data;
};

/**
 * Fetch expenses with optional filtering/sorting
 * @param {Object} params - { category?, sort? }
 */
export const getExpenses = async (params = {}) => {
  const response = await api.get('/expenses', { params });
  return response.data;
};

export default api;
