import { produce } from 'immer';
import { StreamAction, StreamActionTypes } from '../actions/streamActions';
import { ApiStatus, IStream } from '../models';

export const initialStreamState: IStreamState = {
  byId: {},
  ids: [],
  loadingStatus: ApiStatus.IN_PROGRESS,
  open: false,
  addingStatus: ApiStatus.SUCCESS,
  streamId: -1
};

export default function streamReducer(
  state = initialStreamState,
  action: StreamAction
) {
  return produce(state, draft => {
    switch (action.type) {
      case StreamActionTypes.LOAD_STREAMS:
        draft.loadingStatus = ApiStatus.IN_PROGRESS;
        draft.byId = {};
        draft.ids = [];
        break;

      case StreamActionTypes.LOAD_STREAMS_FAILURE:
        draft.loadingStatus = ApiStatus.FAILURE;
        break;

      case StreamActionTypes.LOAD_STREAMS_SUCCESS:
        draft.loadingStatus = ApiStatus.SUCCESS;
        action.payload.streams.forEach(stream => {
          draft.byId[stream.id] = stream;
          draft.ids.push(stream.id);
        });
        break;

      case StreamActionTypes.OPEN_NEW_STREAM_DIALOG:
        draft.open = true;
        break;

      case StreamActionTypes.CLOSE_NEW_STREAM_DIALOG:
        draft.open = false;
        break;

      case StreamActionTypes.CREATE_STREAM:
        draft.addingStatus = ApiStatus.IN_PROGRESS;
        break;

      case StreamActionTypes.CREATE_STREAM_FAILURE:
        draft.addingStatus = ApiStatus.FAILURE;
        break;

      case StreamActionTypes.CREATE_SUCCESS_SUCCESS:
        draft.addingStatus = ApiStatus.SUCCESS;
        draft.open = false;
        break;

      case StreamActionTypes.SELECT_STREAM:
        draft.streamId = action.payload.streamId;
        break;

      case StreamActionTypes.DELETE_STREAM:
        draft.byId[action.payload.streamId].deleting = ApiStatus.IN_PROGRESS;
        break;

      case StreamActionTypes.DELETE_STREAM_FAILURE:
        draft.byId[action.payload.streamId].deleting = ApiStatus.SUCCESS;
        break;

      case StreamActionTypes.DELETE_STREAM_SUCCESS:
        draft.ids.splice(draft.ids.indexOf(action.payload.streamId), 1);
        delete draft.byId[action.payload.streamId];
        break;
    }
  });
}

export interface IStreamState {
  byId: { [key: number]: IStream };
  ids: number[];
  loadingStatus: ApiStatus;
  open: boolean;
  addingStatus: ApiStatus;
  streamId: number;
}
