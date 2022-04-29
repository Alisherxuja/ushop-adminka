import axios from 'axios'
import TokenService from "../../services/TokenService";
import router from '../../router'

// const baseURL = 'http://ushop.loc/api/v1/admin'; //local
const baseURL = 'https://omborxona.uz/api/v1/admin'; //server


const http = axios.create({
    baseURL
});


function setConfiguration(provider) {
    provider.interceptors.request.use(config => {
            let token = TokenService.getToken();

            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            config.headers['Accept'] = 'application/json';
            config.headers['Content-Type'] = 'application/json';
            return config;
        },
        error => Promise.reject(error)
    );
    provider.interceptors.response.use(res => res,
        error => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                TokenService.removeToken();
                TokenService.removeRefreshToken();
                if(router.history.current.name !== 'login') {
                    router.push({name: 'login'})
                }
            }
            return Promise.reject(error)
        });
}

setConfiguration(http)


export default http
