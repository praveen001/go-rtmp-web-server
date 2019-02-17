import produce from 'immer';
import { HeaderActionTypes } from '../actions/headerActions';

export const initialHeaderState: IHeaderState = {
  open: false
};

export default function headerReducer(state = initialHeaderState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case HeaderActionTypes.OPEN_MENU:
        draft.open = true;
        break;

      case HeaderActionTypes.CLOSE_MENU:
        draft.open = false;
        break;
    }
  });
}

export interface IHeaderState {
  open: boolean;
}
