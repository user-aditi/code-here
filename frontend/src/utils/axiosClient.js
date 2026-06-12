import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true, // Keep this if you use cookies
});

// This interceptor adds the token to every request
axiosClient.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem('ACCESS_TOKEN');

        if (token) {
            // Attach the token to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;