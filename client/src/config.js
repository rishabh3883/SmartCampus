// Centralized API and Backend configuration for local and production (Netlify/Vercel/Render)
export const SERVER_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
export const API_BASE_URL = `${SERVER_URL}/api`;
