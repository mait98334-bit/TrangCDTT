const API_URL = 'http://localhost:5000/api';

export async function fetchApi(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            cache: 'no-store', // Force dynamic rendering by disabling fetch cache
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi gọi API:', error);
        return { success: false, message: error.message };
    }
}