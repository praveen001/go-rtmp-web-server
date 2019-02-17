import { Action } from 'redux';
import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import axios from '../axios';

import {
  addedChannel,
  addingChannel,
  ChannelActionTypes,
  deleteChannelFailure,
  deleteChannelSuccess,
  fetchChannelList,
  fetchedChannelList,
  fetchingChannelList,
  IAddChannelAction,
  IDeleteChannelAction,
  IFetchChannelListAction
} from '../actions/channelActions';

export const addChannelEpic: Epic<Action> = action$ =>
  action$
    .ofType(ChannelActionTypes.ADD_CHANNEL)
    .mergeMap((action: IAddChannelAction) =>
      from(axios.post('/channels/add', action.payload))
        .mergeMap(() => [addedChannel()])
        .startWith(addingChannel())
    );

export const addedChannelEpic: Epic<Action> = action$ =>
  action$.ofType(ChannelActionTypes.ADDED_CHANNEL).mapTo(fetchChannelList('1'));

export const fetchChannelEpic: Epic<Action> = action$ =>
  action$
    .ofType(ChannelActionTypes.FETCH_CHANNEL_LIST)
    .mergeMap((action: IFetchChannelListAction) =>
      from(axios.get(`/channels/list?streamId=${action.payload.streamId}`))
        .mergeMap(response => [fetchedChannelList(response.data.data)])
        .startWith(fetchingChannelList())
    );

export const deleteChannelEpic: Epic<Action> = action$ =>
  action$
    .ofType(ChannelActionTypes.DELETE_CHANNEL)
    .mergeMap((action: IDeleteChannelAction) =>
      from(
        axios.delete(
          `/channels/delete?streamId=${action.payload.streamId}&channelId=${
            action.payload.channelId
          }`
        )
      )
        .mergeMap(response => [
          deleteChannelSuccess(
            action.payload.streamId,
            action.payload.channelId
          )
        ])
        .catch(() => of(deleteChannelFailure()))
    );

export default combineEpics(
  addChannelEpic,
  addedChannelEpic,
  fetchChannelEpic,
  deleteChannelEpic
);
