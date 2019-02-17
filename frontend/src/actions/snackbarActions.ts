import { IToast } from '../reducers/snackbarReducer';

export enum SnackbarActionTypes {
  SHOW_SNACKBAR = 'snackbar/show',
  HIDE_SNACKBAR = 'snackbar/hide'
}

export function showSnackbar(
  message: string,
  error: boolean
): IShowSnackbarAction {
  return {
    type: SnackbarActionTypes.SHOW_SNACKBAR,
    payload: { message, error }
  };
}

export function hideSnackbar(id: number): IHideSnackbarAction {
  return {
    type: SnackbarActionTypes.HIDE_SNACKBAR,
    payload: {
      id
    }
  };
}

export interface IShowSnackbarAction {
  type: SnackbarActionTypes.SHOW_SNACKBAR;
  payload: Pick<IToast, 'message' | 'error'>;
}

export interface IHideSnackbarAction {
  type: SnackbarActionTypes.HIDE_SNACKBAR;
  payload: {
    id: number;
  };
}

export type SnackbarAction = IShowSnackbarAction | IHideSnackbarAction;
