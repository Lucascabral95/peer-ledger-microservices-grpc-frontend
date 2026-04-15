import {
  LoginRequestInterface,
  RegisterRequestInterface,
} from "@/domain/interfaces";

export type LoginFormValues = LoginRequestInterface;
export type RegisterFormValues = RegisterRequestInterface;

export const LOGIN_DEFAULT_VALUES: LoginFormValues = {
  email: "",
  password: "",
};

export const REGISTER_DEFAULT_VALUES: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
};
