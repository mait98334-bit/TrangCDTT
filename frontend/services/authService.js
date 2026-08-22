import { fetchApi } from './apiService';

export const AuthService = {
    login: (email, password) => fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }),
    register: (data) => fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    forgotPassword: (email) => fetchApi('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
    }),
    resetPassword: (email, code, newPassword) => fetchApi('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, code, newPassword })
    })
};
