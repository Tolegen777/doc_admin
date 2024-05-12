export const regExpValidator = {
  emailRule: new RegExp(/\S+@\S+\.\S+/),
  stringRule: new RegExp(/^[a-zA-Zа-яА-ЯҒғҚқҢңӘәӨөҰұІіҮүҺһ]+$/i),
  urlRule: new RegExp(/^(https?:\/\/)./),
};
