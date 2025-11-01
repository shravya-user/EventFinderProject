import axiosInstance from './axiosInstance';

// ✅ Don't include /api again
export const signupUser = (userData) => axiosInstance.post('/auth/signup', userData);
export const loginUser = (userData) => axiosInstance.post('/auth/login', userData);
export const getMe = () => axiosInstance.get('/auth/me');
