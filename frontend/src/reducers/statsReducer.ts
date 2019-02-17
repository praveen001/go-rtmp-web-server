import produce from 'immer';
import { StatsAction, StatsActionTypes } from '../actions/statsActions';
import { defaultStats, IStats } from '../models';

export const initialStatsState: IStatsState = {
  byId: {}
};

export default function statsReducer(
  state = initialStatsState,
  action: StatsAction
) {
  return produce(state, draft => {
    switch (action.type) {
      case StatsActionTypes.STREAM_ONLINE:
        draft.byId[action.payload.streamId] = defaultStats;
        draft.byId[action.payload.streamId].online = true;
        break;

      case StatsActionTypes.STREAM_OFFLINE:
        draft.byId[action.payload.streamId].online = false;
        draft.byId[action.payload.streamId].previewReady = false;
        break;

      case StatsActionTypes.PREVIEW_READY:
        draft.byId[action.payload.streamId].previewReady = true;
        break;
    }
  });
}

export interface IStatsState {
  byId: { [key: number]: IStats };
}
