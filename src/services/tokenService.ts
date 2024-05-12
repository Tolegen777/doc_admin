import {tokenConstants} from "../const/tokenConstants.ts";

export const tokenService = {
  getLocalRefreshToken: (): string => {
    return localStorage.getItem(tokenConstants.refresh) ?? '';
  },

  getLocalAccessToken: (): string => {
    return localStorage.getItem(tokenConstants.access) ?? '';
  },

  updateLocalTokenData: (token: string, tokenType: 'access' | 'refresh'): void => {
    const key = tokenType === 'access' ? tokenConstants.access : tokenConstants.refresh
    localStorage.setItem(key, token);
  },
};
