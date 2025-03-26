export interface ILoginInput {
  username: string;
  password: string;
}

export interface IAuthResponse {
  access: string;
  refresh: string;
}
