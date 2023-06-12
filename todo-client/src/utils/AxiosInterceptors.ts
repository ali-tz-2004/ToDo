import axios from "axios";

const getToken = () => localStorage.getItem('token')?.replace(/"/g, '');

axios.defaults.baseURL = "http://localhost:5147";

axios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(
    (response) => {
        console.log(response.data);
        return response
    },
    (error) => {
        console.error(error);
        return Promise.reject(error);
    }
);