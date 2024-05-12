export interface ILoginInput {
  email: string;
  password: string;
}

export interface IAuthResponse {
  access: string;
  refresh: string;
}
