import { tokenService } from "./tokenService";
import { websocketService } from "./websocketService";

export const resetService = () => {
  // Отключаем WebSocket перед очисткой токенов
  websocketService.disconnect();

  // Очищаем токены
  tokenService.updateLocalTokenData("", "access");
  tokenService.updateLocalTokenData("", "refresh");

  // Перенаправляем на логин
  window.location.replace("/login");
};
