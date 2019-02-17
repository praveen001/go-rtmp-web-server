import { produce } from 'immer';
import Cookie from 'js-cookie';

// Types
import {
  AuthenticationAction,
  AuthenticationActionTypes
} from '../actions/authenticationActions';

const token = localStorage.getItem('token') || '';

export const initialAuthenticationState: IAuthenticationState = {
  isAuthenticated: false,
  loading: token ? true : false,
  loaded: false,
  token,
  user: {}
};

export default function authenticationReducer(
  state: IAuthenticationState = initialAuthenticationState,
  action: AuthenticationAction
): IAuthenticationState {
  return produce(state, draft => {
    switch (action.type) {
      case AuthenticationActionTypes.AUTHENTICATE_TOKEN:
        localStorage.setItem('token', action.payload.token);
        Cookie.set('token', action.payload.token);
        draft.token = action.payload.token;
        break;

      case AuthenticationActionTypes.AUTHENTICATING_TOKEN:
        draft.loading = true;
        break;

      case AuthenticationActionTypes.AUTHENTICATED_TOKEN:
        draft.isAuthenticated = true;
        draft.loading = false;
        draft.loaded = true;
        draft.token = action.payload.token;
        draft.user = action.payload.user;
        break;

      case AuthenticationActionTypes.LOGOUT:
        localStorage.removeItem('token');
        Cookie.remove('token');
        draft.isAuthenticated = false;
        draft.user = {};
        draft.token = '';
        break;

      default:
        return state;
    }
  });
}

export interface IAuthenticationState {
  isAuthenticated: boolean;
  loading: boolean;
  loaded: boolean;
  token: string;
  user: any;
}
