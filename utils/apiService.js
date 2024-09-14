import axios from 'axios';

// Get the token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

const apiService = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust the base URL as needed
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include the token in the headers
apiService.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Add a response interceptor for handling responses
apiService.interceptors.response.use(response => response, error => Promise.reject(error));

export default apiService;
