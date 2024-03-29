import axios from 'axios';
import router from '../router';
import { useAccountStore } from './../stores/account';

const logoutErrors = [
    40102, // No token provided
    40103, // Invalid token
];

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common.Accept = 'application/json';
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const accountStore = useAccountStore();
        
        /**
         * Unauthorized
         */
        if (error.response.status === 401) {
            const errorCode = error.response.data.error.code;

            /**
             * Token expired
             */
            if (errorCode === 40101) {
                if (router.currentRoute.value.meta.auth == true || Object.keys(router.currentRoute.value.meta).length == 0) {
                    accountStore.sessionExpired();
                    router.push({ name: 'sessionExpired' });
                }
                return Promise.reject(error);
            }

            /**
             * Login required
             */
            if (errorCode === 40102) {
                router.push({ name: 'login' });
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

axios.interceptors.request.use(
    (config) => {
        if (localStorage.getItem('id_token')) {
            config.headers.Authorization = `Bearer ${localStorage.getItem('id_token')}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axios;