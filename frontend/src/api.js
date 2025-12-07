

import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://hubcredo-ep5y.onrender.com/api',
  headers: { 'Content-Type': 'application/json' }
});

export default API;
