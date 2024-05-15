import { tokenService } from './tokenService';

export const resetService = () => {
  tokenService.updateLocalTokenData('', 'access');
  tokenService.updateLocalTokenData('', 'refresh');
  window.location.replace('/login');
};
