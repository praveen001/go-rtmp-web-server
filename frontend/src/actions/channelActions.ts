import { IChannel } from '../models';

export enum ChannelActionTypes {
  ADD_CHANNEL = 'channels/Add',
  ADDING_CHANNEL = 'channels/addingChannel',
  ADDED_CHANNEL = 'channels/addedChannel',
  FETCH_CHANNEL_LIST = 'channels/fetch',
  FETCHING_CHANNEL_LIST = 'channels/fetchingList',
  FETCHED_CHANNEL_LIST = 'channels/fetchedList',
  SHOW_ADD_CHANNEL = 'channels/showAddChannel',
  HIDE_ADD_CHANNEL = 'channels/hideAddChannel',
  DELETE_CHANNEL = 'channels/deleteChannel',
  DELETE_CHANNEL_FAILURE = 'channels/deleteChannelFailure',
  DELETE_CHANNEL_SUCCESS = 'channels/deleteChannelSuccess'
}

export function addChannel(
  name: string,
  url: string,
  key: string
): IAddChannelAction {
  return {
    type: ChannelActionTypes.ADD_CHANNEL,
    payload: {
      name,
      url,
      key
    }
  };
}

export function addingChannel(): IAddingChannelAction {
  return { type: ChannelActionTypes.ADDING_CHANNEL };
}

export function addedChannel(): IAddedChannelAction {
  return { type: ChannelActionTypes.ADDED_CHANNEL };
}

export function fetchChannelList(streamId: string): IFetchChannelListAction {
  return {
    type: ChannelActionTypes.FETCH_CHANNEL_LIST,
    payload: {
      streamId
    }
  };
}

export function fetchingChannelList(): IFetchingChannelListAction {
  return {
    type: ChannelActionTypes.FETCHING_CHANNEL_LIST
  };
}

export function fetchedChannelList(
  channels: IChannel[]
): IFetchedChannelListAction {
  return {
    type: ChannelActionTypes.FETCHED_CHANNEL_LIST,
    payload: { channels }
  };
}

export function showAddChannel(): IShowAddChannelAction {
  return {
    type: ChannelActionTypes.SHOW_ADD_CHANNEL
  };
}

export function hideAddChannel(): IHideAddChannelAction {
  return {
    type: ChannelActionTypes.HIDE_ADD_CHANNEL
  };
}

export function deleteChannel(
  streamId: number,
  channelId: number
): IDeleteChannelAction {
  return {
    type: ChannelActionTypes.DELETE_CHANNEL,
    payload: {
      streamId,
      channelId
    }
  };
}

export function deleteChannelFailure(): IDeleteChannelFailureAction {
  return {
    type: ChannelActionTypes.DELETE_CHANNEL_FAILURE
  };
}

export function deleteChannelSuccess(
  streamId: number,
  channelId: number
): IDeleteChannelSuccessAction {
  return {
    type: ChannelActionTypes.DELETE_CHANNEL_SUCCESS,
    payload: { streamId, channelId }
  };
}

export interface IAddChannelAction {
  type: ChannelActionTypes.ADD_CHANNEL;
  payload: {
    name: string;
    url: string;
    key: string;
  };
}

export interface IAddingChannelAction {
  type: ChannelActionTypes.ADDING_CHANNEL;
}

export interface IAddedChannelAction {
  type: ChannelActionTypes.ADDED_CHANNEL;
}

export interface IFetchChannelListAction {
  type: ChannelActionTypes.FETCH_CHANNEL_LIST;
  payload: {
    streamId: string;
  };
}

export interface IFetchingChannelListAction {
  type: ChannelActionTypes.FETCHING_CHANNEL_LIST;
}

export interface IFetchedChannelListAction {
  type: ChannelActionTypes.FETCHED_CHANNEL_LIST;
  payload: {
    channels: IChannel[];
  };
}

export interface IShowAddChannelAction {
  type: ChannelActionTypes.SHOW_ADD_CHANNEL;
}

export interface IHideAddChannelAction {
  type: ChannelActionTypes.HIDE_ADD_CHANNEL;
}

export interface IDeleteChannelAction {
  type: ChannelActionTypes.DELETE_CHANNEL;
  payload: {
    streamId: number;
    channelId: number;
  };
}

export interface IDeleteChannelFailureAction {
  type: ChannelActionTypes.DELETE_CHANNEL_FAILURE;
}

export interface IDeleteChannelSuccessAction {
  type: ChannelActionTypes.DELETE_CHANNEL_SUCCESS;
  payload: {
    streamId: number;
    channelId: number;
  };
}

export type ChannelAction =
  | IAddChannelAction
  | IAddingChannelAction
  | IAddedChannelAction
  | IFetchChannelListAction
  | IFetchingChannelListAction
  | IFetchedChannelListAction
  | IShowAddChannelAction
  | IHideAddChannelAction
  | IDeleteChannelAction
  | IDeleteChannelFailureAction
  | IDeleteChannelSuccessAction;
