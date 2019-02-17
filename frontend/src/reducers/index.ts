import { connectRouter, LocationChangeAction } from 'connected-react-router';
import { createBrowserHistory, LocationState } from 'history';
import { Reducer } from 'react';
import { combineReducers } from 'redux';
import authenticationReducer, {
  IAuthenticationState,
  initialAuthenticationState
} from './authReducer';
import channelReducer, {
  IChannelState,
  initialChannelState
} from './channelReducer';
import headerReducer, {
  IHeaderState,
  initialHeaderState
} from './headerReducer';
import snackbarReducer, {
  initialSnackbarState,
  ISnackbarState
} from './snackbarReducer';
import socketReducer, {
  initialSocketState,
  ISocketState
} from './socketReducer';
import statsReducer, { initialStatsState, IStatsState } from './statsReducer';
import streamReducer, {
  initialStreamState,
  IStreamState
} from './streamReducer';
import themeReducer, { initialThemeState, IThemeState } from './themeReducer';

export const history = createBrowserHistory();

export interface IState {
  theme: IThemeState;
  auth: IAuthenticationState;
  router: Reducer<LocationState, LocationChangeAction>;
  channels: IChannelState;
  streams: IStreamState;
  socket: ISocketState;
  header: IHeaderState;
  stats: IStatsState;
  snackbar: ISnackbarState;
}

export const initialState = {
  theme: initialThemeState,
  auth: initialAuthenticationState,
  channels: initialChannelState,
  streams: initialStreamState,
  socket: initialSocketState,
  header: initialHeaderState,
  stats: initialStatsState,
  snackbar: initialSnackbarState
};

export default combineReducers({
  theme: themeReducer,
  auth: authenticationReducer,
  router: connectRouter(history),
  channels: channelReducer,
  streams: streamReducer,
  socket: socketReducer,
  header: headerReducer,
  stats: statsReducer,
  snackbar: snackbarReducer
});
