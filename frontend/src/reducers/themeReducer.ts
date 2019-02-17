import produce from 'immer';

import { CounterAction, ThemeActionTypes } from '../actions/themeActions';

export const initialThemeState: IThemeState = {
  type: 'dark'
};

export default function themeReducer(
  state: IThemeState = initialThemeState,
  action: CounterAction
): IThemeState {
  return produce(state, draft => {
    switch (action.type) {
      case ThemeActionTypes.TOGGLE_THEME:
        draft.type = draft.type === 'light' ? 'dark' : 'light';
        break;

      default:
        break;
    }
  });
}

export interface IThemeState {
  type: string;
}
