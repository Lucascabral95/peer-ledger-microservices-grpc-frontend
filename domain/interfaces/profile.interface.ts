export interface MeProfileResponseInterface {
  error: boolean;
  message: string;
  data: MeProfileDataInterface;
}

export interface MeProfileDataInterface {
  user_id: string;
  name: string;
  email: string;
}
