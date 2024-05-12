import type { ILoginInput, IAuthResponse } from '../types/authTypes';
import { axiosInstance } from './index';
import axios from "axios";

export const authApi = {
  signInUser: async (user: ILoginInput) => {
    const response = await axiosInstance.post<IAuthResponse>('partners/auth/partner-employee-login/', user);
    return response.data
  },

  signOutUser: async () => {
    const response = await axiosInstance.post<IAuthResponse>('partners/auth/partner-employee-logout/');
    return response.data
  },

  refreshAccessToken: async (refresh_token: string) => {
    const response = await axios.post<IAuthResponse>('https://sandbox.sootki.com/api/v1/partners/auth/refresh-token/', { refresh: refresh_token })
    return response.data
  },
};
