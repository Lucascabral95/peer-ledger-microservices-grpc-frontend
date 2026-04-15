export interface AuthUserModel {
  email: string;
  name: string;
  user_id: string;
}

export interface AuthSessionModel {
  expires_in: number;
  refresh_token: string;
  token: string;
  token_type: string;
  user: AuthUserModel;
}
