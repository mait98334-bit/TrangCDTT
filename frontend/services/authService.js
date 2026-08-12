import { fetchApi } from './apiService';

export const AuthService = {
    login: (email, password) => fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }),
    register: (username, email, password) => fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
    })
};
