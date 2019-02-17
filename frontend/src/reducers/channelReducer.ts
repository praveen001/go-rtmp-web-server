import produce from 'immer';

import { ChannelAction, ChannelActionTypes } from '../actions/channelActions';
import { IChannel } from '../models';

export const initialChannelState: IChannelState = {
  loading: false,
  byId: {},
  ids: [],
  addChannelOpen: false
};

export default function channelReducer(
  state: IChannelState = initialChannelState,
  action: ChannelAction
): IChannelState {
  return produce(state, draft => {
    switch (action.type) {
      case ChannelActionTypes.FETCHED_CHANNEL_LIST:
        action.payload.channels.forEach(channel => {
          draft.byId[channel.id] = channel;
          draft.ids.push(channel.id);
        });
        draft.loading = false;
        break;

      case ChannelActionTypes.FETCHING_CHANNEL_LIST:
      case ChannelActionTypes.ADDING_CHANNEL:
        draft.loading = true;
        draft.byId = {};
        draft.ids = [];
        break;

      case ChannelActionTypes.SHOW_ADD_CHANNEL:
        draft.addChannelOpen = true;
        break;

      case ChannelActionTypes.HIDE_ADD_CHANNEL:
        draft.addChannelOpen = false;
        break;

      case ChannelActionTypes.DELETE_CHANNEL_SUCCESS:
        delete draft.byId[action.payload.channelId];
        draft.ids.splice(draft.ids.indexOf(action.payload.channelId), 1);
        break;

      default:
        break;
    }
  });
}

export interface IChannelState {
  byId: { [key: number]: IChannel };
  ids: number[];
  loading: boolean;
  addChannelOpen: boolean;
}
