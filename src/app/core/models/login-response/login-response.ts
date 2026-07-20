import { CurrentUser } from "../current-user/current-user";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: CurrentUser;
  roles: string[];
  permissions: string[];

}
