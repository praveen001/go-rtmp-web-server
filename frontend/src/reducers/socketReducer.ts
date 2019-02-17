import produce from 'immer';
import { SocketActionTypes } from '../actions/socketActions';
import { ApiStatus } from '../models';

export const initialSocketState = {
  status: ApiStatus.IN_PROGRESS,
  wasConnected: false
};

export default function socketReducer(state = initialSocketState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case SocketActionTypes.CONNECT:
        draft.status = ApiStatus.IN_PROGRESS;
        break;

      case SocketActionTypes.CONNECTED:
        draft.status = ApiStatus.SUCCESS;
        draft.wasConnected = true;
        break;

      case SocketActionTypes.SENT_MESSAGE:
        break;

      case SocketActionTypes.DISCONNECTED:
        draft.status = ApiStatus.FAILURE;
        break;

      default:
    }
  });
}

export interface ISocketState {
  status: ApiStatus;
  wasConnected: boolean;
}
