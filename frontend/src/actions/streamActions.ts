import { IStream } from '../models';

export enum StreamActionTypes {
  LOAD_STREAMS = 'streams/loadStreams',
  LOAD_STREAMS_FAILURE = 'streams/loadStreamsFailure',
  LOAD_STREAMS_SUCCESS = 'streams/loadStreamsSuccess',
  OPEN_NEW_STREAM_DIALOG = 'streams/openNewStreamDialog',
  CLOSE_NEW_STREAM_DIALOG = 'streams/closeNewStreamDialog',
  CREATE_STREAM = 'streams/createStream',
  CREATE_STREAM_FAILURE = 'streams/createStreamFailure',
  CREATE_SUCCESS_SUCCESS = 'streams/createStreamSuccess',
  SELECT_STREAM = 'streams/selectStream',
  DELETE_STREAM = 'streams/deleteStream',
  DELETE_STREAM_FAILURE = 'streams/deleteStreamFailure',
  DELETE_STREAM_SUCCESS = 'streams/deleteStreamSuccess'
}

export function loadStreams(): ILoadStreamsAction {
  return { type: StreamActionTypes.LOAD_STREAMS };
}

export function loadStreamsFailure(): ILoadStreamsFailureAction {
  return { type: StreamActionTypes.LOAD_STREAMS_FAILURE };
}

export function loadStreamsSuccess(
  streams: IStream[]
): ILoadStreamsSuccessAction {
  return { type: StreamActionTypes.LOAD_STREAMS_SUCCESS, payload: { streams } };
}

export function openNewStreamDialog() {
  return {
    type: StreamActionTypes.OPEN_NEW_STREAM_DIALOG
  };
}

export function closeNewStreamDialog() {
  return {
    type: StreamActionTypes.CLOSE_NEW_STREAM_DIALOG
  };
}

export function createStream(name: string): ICreateStreamAction {
  return {
    type: StreamActionTypes.CREATE_STREAM,
    payload: {
      name
    }
  };
}

export function createStreamFailure(): ICreateStreamFailureAction {
  return {
    type: StreamActionTypes.CREATE_STREAM_FAILURE
  };
}

export function createStreamSuccess(): ICreateStreamSuccessAction {
  return {
    type: StreamActionTypes.CREATE_SUCCESS_SUCCESS
  };
}

export function selectStream(streamId: string): ISelectStreamAction {
  return {
    type: StreamActionTypes.SELECT_STREAM,
    payload: {
      streamId: parseInt(streamId, 10)
    }
  };
}

export function deleteStream(streamId: number): IDeleteStreamAction {
  return {
    type: StreamActionTypes.DELETE_STREAM,
    payload: {
      streamId
    }
  };
}

export function deleteStreamFailure(
  streamId: number
): IDeleteStreamFailureAction {
  return {
    type: StreamActionTypes.DELETE_STREAM_FAILURE,
    payload: {
      streamId
    }
  };
}

export function deleteStreamSuccess(
  streamId: number
): IDeleteStreamSuccessAction {
  return {
    type: StreamActionTypes.DELETE_STREAM_SUCCESS,
    payload: {
      streamId
    }
  };
}

export interface ILoadStreamsAction {
  type: StreamActionTypes.LOAD_STREAMS;
}

export interface ILoadStreamsFailureAction {
  type: StreamActionTypes.LOAD_STREAMS_FAILURE;
}

export interface ILoadStreamsSuccessAction {
  type: StreamActionTypes.LOAD_STREAMS_SUCCESS;
  payload: {
    streams: IStream[];
  };
}

export interface IOpenNewStreamDialogAction {
  type: StreamActionTypes.OPEN_NEW_STREAM_DIALOG;
}

export interface ICloseNewStreamDialogAction {
  type: StreamActionTypes.CLOSE_NEW_STREAM_DIALOG;
}

export interface ICreateStreamAction {
  type: StreamActionTypes.CREATE_STREAM;
  payload: {
    name: string;
  };
}

export interface ICreateStreamFailureAction {
  type: StreamActionTypes.CREATE_STREAM_FAILURE;
}

export interface ICreateStreamSuccessAction {
  type: StreamActionTypes.CREATE_SUCCESS_SUCCESS;
}

export interface ISelectStreamAction {
  type: StreamActionTypes.SELECT_STREAM;
  payload: {
    streamId: number;
  };
}

export interface IDeleteStreamAction {
  type: StreamActionTypes.DELETE_STREAM;
  payload: {
    streamId: number;
  };
}

export interface IDeleteStreamFailureAction {
  type: StreamActionTypes.DELETE_STREAM_FAILURE;
  payload: {
    streamId: number;
  };
}

export interface IDeleteStreamSuccessAction {
  type: StreamActionTypes.DELETE_STREAM_SUCCESS;
  payload: {
    streamId: number;
  };
}

export type StreamAction =
  | ILoadStreamsAction
  | ILoadStreamsFailureAction
  | ILoadStreamsSuccessAction
  | IOpenNewStreamDialogAction
  | ICloseNewStreamDialogAction
  | ICreateStreamAction
  | ICreateStreamFailureAction
  | ICreateStreamSuccessAction
  | ISelectStreamAction
  | IDeleteStreamAction
  | IDeleteStreamFailureAction
  | IDeleteStreamSuccessAction;
