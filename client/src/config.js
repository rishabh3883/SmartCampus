// Centralized API and Backend configuration
// In local dev -> defaults to http://localhost:5000
// In Vercel Fullstack -> defaults to window.location.origin (same domain)
// In Custom Deploy -> uses VITE_BACKEND_URL
const getBaseUrl = () => {
    if (import.meta.env.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL;
    }
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        return window.location.origin;
    }
    return 'http://localhost:5000';
};

export const SERVER_URL = getBaseUrl();
export const API_BASE_URL = `${SERVER_URL}/api`;
