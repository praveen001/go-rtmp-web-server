import produce from 'immer';
import {
  SnackbarAction,
  SnackbarActionTypes
} from '../actions/snackbarActions';

export const initialSnackbarState: ISnackbarState = {
  byId: {},
  ids: []
};

export default function snackbarReducer(
  state: ISnackbarState = initialSnackbarState,
  action: SnackbarAction
) {
  return produce(state, draft => {
    switch (action.type) {
      case SnackbarActionTypes.SHOW_SNACKBAR:
        draft.byId[draft.ids.length] = {
          id: draft.ids.length,
          ...action.payload
        };
        draft.ids.push(draft.ids.length);
        break;

      case SnackbarActionTypes.HIDE_SNACKBAR:
        draft.ids.splice(draft.ids.indexOf(action.payload.id), 1);
        delete draft.byId[action.payload.id];
        break;
    }
  });
}

export interface ISnackbarState {
  byId: {
    [key: string]: IToast;
  };
  ids: number[];
}

export interface IToast {
  id: number;
  message: string;
  error: boolean;
}
