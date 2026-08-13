import { fetchApi } from './apiService';

export const AuthService = {
    login: (email, password) => fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }),
    register: (data) => fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};
