export enum AuthenticationActionTypes {
  REGISTER = 'auth/register',
  LOGIN = 'auth/login',
  AUTHENTICATE_TOKEN = 'auth/authenticateUser',
  AUTHENTICATING_TOKEN = 'auth/authenticatingUser',
  AUTHENTICATED_TOKEN = 'auth/authenticatedUser',
  LOGOUT = 'auth/logout'
}

export function register(
  name: string,
  email: string,
  password: string
): IRegisterAction {
  return {
    type: AuthenticationActionTypes.REGISTER,
    payload: {
      name,
      email,
      password
    }
  };
}

export function login(
  email: string,
  password: string,
  rememberMe: boolean
): ILoginAction {
  return {
    type: AuthenticationActionTypes.LOGIN,
    payload: { email, password, rememberMe }
  };
}

export function authenticateUser(token: string): IAuthenticateUserAction {
  return {
    type: AuthenticationActionTypes.AUTHENTICATE_TOKEN,
    payload: {
      token
    }
  };
}

export function authenticatingUser(): IAuthenticatingUserAction {
  return {
    type: AuthenticationActionTypes.AUTHENTICATING_TOKEN
  };
}

export function authenticatedUser(
  token: string,
  user: any,
  shouldRedirect: boolean
): IAuthenticatedUserAction {
  return {
    type: AuthenticationActionTypes.AUTHENTICATED_TOKEN,
    payload: { token, user, shouldRedirect }
  };
}

export function logout(): ILogoutAction {
  return { type: AuthenticationActionTypes.LOGOUT };
}

export interface IRegisterAction {
  type: AuthenticationActionTypes.REGISTER;
  payload: {
    name: string;
    email: string;
    password: string;
  };
}

export interface ILoginAction {
  type: AuthenticationActionTypes.LOGIN;
  payload: {
    email: string;
    password: string;
    rememberMe: boolean;
  };
}

export interface IAuthenticateUserAction {
  type: AuthenticationActionTypes.AUTHENTICATE_TOKEN;
  payload: {
    token: string;
  };
}

export interface IAuthenticatingUserAction {
  type: AuthenticationActionTypes.AUTHENTICATING_TOKEN;
}

export interface IAuthenticatedUserAction {
  type: AuthenticationActionTypes.AUTHENTICATED_TOKEN;
  payload: {
    token: string;
    user: any;
    shouldRedirect: boolean;
  };
}

export interface ILogoutAction {
  type: AuthenticationActionTypes.LOGOUT;
}

export type AuthenticationAction =
  | IRegisterAction
  | ILoginAction
  | IAuthenticateUserAction
  | IAuthenticatingUserAction
  | IAuthenticatedUserAction
  | ILogoutAction;
