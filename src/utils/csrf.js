import API from '../api/api';

export const getCsrfToken = async () => {
    try {
        const response = await API.get('/csrf-token');
        return response.data.csrfToken;
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        throw error;
    }
};

export const setupCsrfToken = async () => {
    const token = await getCsrfToken();
    API.defaults.headers.common['CSRF-Token'] = token;
};