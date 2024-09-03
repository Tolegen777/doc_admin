// eslint-disable-next-line prettier/prettier
import type {AxiosError, AxiosRequestConfig, AxiosRequestHeaders} from 'axios';
import axios from 'axios';
import {tokenService} from '../services/tokenService';
import {customNotification} from '../utils/customNotification';
import {authApi} from './authApi';

type FailedQueue = {
    reject: (error: Error | null) => void;
    resolve: (token: string | null) => void;
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// for multiple requests
// eslint-disable-next-line functional/no-let
let isRefreshing = false;
// eslint-disable-next-line functional/no-let
let failedQueue: FailedQueue[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

// @ts-ignore
axiosInstance.interceptors.request.use((config) => {
    const accessToken = tokenService.getLocalAccessToken()

    if (accessToken) {
        return {
            ...config,
            headers: {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`,
            }
        }
    }

    return config
})


axiosInstance.interceptors.response.use(
    ( response ) =>
        response, async ( error ) => {

        const originalRequest: AxiosRequestConfig<AxiosRequestHeaders> & {
            _retry: boolean
        } = error.config

        const errorStatus = error.response.status;
        const errorCode = error.response.data?.code;

        if (errorStatus === 401 && !originalRequest._retry && tokenService.getLocalAccessToken() && errorCode === 'token_not_valid') {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {

                    failedQueue.push({ resolve, reject })


                }).then((token) => {

                    if (originalRequest.headers) {
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        originalRequest.headers.Authorization = `Bearer ${token}`
                    }

                    return axiosInstance(originalRequest)

                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise((resolve, reject) => {
                void authApi.refreshAccessToken(tokenService.getLocalRefreshToken()).then((response) => {

                    // Set refresh access and refresh token
                    tokenService.updateLocalTokenData(response?.access as string, 'access')

                    axios.defaults.headers.common.Authorization = `Bearer ${response?.access}`;

                    if (originalRequest && originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${response?.access}`;
                    }

                    // Send requests without errors, with new access token
                    processQueue(null, response?.access)
                    resolve(axiosInstance(originalRequest))

                }).catch((err: AxiosError) => {
                    processQueue(err, null)
                    reject(error)
                }).then(() => {
                    isRefreshing = false
                })
            })
        }

        if (errorStatus !== 401) {
            const errorMessage = error?.response?.data?.non_field_errors?.find((item: string) => item) ||
                error?.response?.data?.errors?.non_field_errors?.find((item: string) => item) ||
                error?.response?.data?.detail?.non_field_errors?.join('') ||
                error?.response?.data?.detail ||
                error?.response?.data?.error

            customNotification({
                type: 'error',
                message: errorMessage?.length ? errorMessage : 'Ошибка сервера'
            })
        }

        return Promise.reject(error)
    });





