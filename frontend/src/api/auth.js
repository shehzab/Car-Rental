import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const loginUser = (data) => axios.post(`${API}/auth/login`, data);
export const registerUser = (data) => axios.post(`${API}/auth/register`, data);
