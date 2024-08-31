import type { ILoginInput, IAuthResponse } from '../types/authTypes';
import { axiosInstance } from './index';
import axios from "axios";
import {customConfirmAction} from "../utils/customConfirmAction.ts";
import {resetService} from "../services/resetService.ts";

export const authApi = {
  signInUser: async (user: ILoginInput) => {
    const response = await axiosInstance.post<IAuthResponse>('partners/auth/partner-employee-login/', user);
    return response.data
  },

  signOutUser: async () => {
    const response = await axiosInstance.post<IAuthResponse>('partners/auth/partner-employee-logout/');
    return response.data
  },

  refreshAccessToken: async (refresh_token: string): Promise<IAuthResponse | null> => {
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const response = await axios.post<IAuthResponse>(BASE_URL + 'partners/auth/refresh-token/', { refresh: refresh_token });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Обработка ошибок, связанных с axios
        console.log(error, 'KKK')
        const errorMessage = error.response?.data?.detail?.find((item: string) => item)
        console.log(errorMessage, 'LLL')
        if (errorMessage === 'Refresh token is invalid or expired') {
          customConfirmAction({
            message: 'Время вашего сеанса истекло, пожалуйста, войдите снова!',
            action: resetService,
            alignTop: true,
            hideCancelButton: true,
            okBtnText: 'Выйти'
          })
        }
      } else {
        // Обработка других ошибок
        console.log('Произошла ошибка:', error);
      }
      return null; // Возвращаем null или другое значение, чтобы указать, что обновление токена не удалось
    }
  }
};
