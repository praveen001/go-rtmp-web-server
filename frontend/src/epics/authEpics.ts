import { Action } from 'redux';
import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import axios from '../axios';

import { push } from 'connected-react-router';
import { mapTo } from 'rxjs-compat/operator/mapTo';
import {
  authenticatedUser,
  authenticatingUser,
  AuthenticationActionTypes,
  IAuthenticatedUserAction,
  IAuthenticateUserAction,
  ILoginAction,
  IRegisterAction
} from '../actions/authenticationActions';

export const registerEpic: Epic<Action> = action$ =>
  action$
    .ofType(AuthenticationActionTypes.REGISTER)
    .mergeMap((action: IRegisterAction) =>
      from(axios.post('/users/register', action.payload))
        .mergeMap(response => [
          authenticatedUser(
            response.data.data.token,
            response.data.data.user,
            true
          )
        ])
        .startWith(authenticatingUser())
    );

export const loginEpic: Epic<Action> = action$ =>
  action$
    .ofType(AuthenticationActionTypes.LOGIN)
    .mergeMap((action: ILoginAction) =>
      from(axios.post('/users/login', action.payload))
        .mergeMap(response => [
          authenticatedUser(
            response.data.data.token,
            response.data.data.user,
            true
          )
        ])
        .startWith(authenticatingUser())
    );

export const authenticatedUserEpic: Epic<Action> = action$ =>
  action$
    .ofType(AuthenticationActionTypes.AUTHENTICATED_TOKEN)
    .mergeMap((action: IAuthenticatedUserAction) => {
      if (!action.payload.shouldRedirect) {
        return of({ type: 'noop' });
      }
      return of(push('/streams'));
    });

export const authenticateUserEpic: Epic<Action> = action$ =>
  action$
    .ofType(AuthenticationActionTypes.AUTHENTICATE_TOKEN)
    .mergeMap((action: IAuthenticateUserAction) =>
      from(axios.get(`/users/tokeninfo?token=${action.payload.token}`))
        .map(response =>
          authenticatedUser(action.payload.token, response.data.data, false)
        )
        .startWith(authenticatingUser())
    );

export default combineEpics(
  registerEpic,
  loginEpic,
  authenticatedUserEpic,
  authenticateUserEpic
);
