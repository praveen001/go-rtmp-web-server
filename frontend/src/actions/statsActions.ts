export enum StatsActionTypes {
  STREAM_ONLINE = 'stats/streamOnline',
  STREAM_OFFLINE = 'stats/streamOffline',
  PREVIEW_READY = 'stats/previewReady'
}

export function streamOnline(streamId: number): IStreamOnlineAction {
  return {
    type: StatsActionTypes.STREAM_ONLINE,
    payload: {
      streamId
    }
  };
}

export function streamOffline(streamId: number): IStreamOfflineAction {
  return {
    type: StatsActionTypes.STREAM_OFFLINE,
    payload: {
      streamId
    }
  };
}

export function previewReady(streamId: number): IPreviewReadyAction {
  return {
    type: StatsActionTypes.PREVIEW_READY,
    payload: {
      streamId
    }
  };
}

export interface IStreamOnlineAction {
  type: StatsActionTypes.STREAM_ONLINE;
  payload: {
    streamId: number;
  };
}

export interface IStreamOfflineAction {
  type: StatsActionTypes.STREAM_OFFLINE;
  payload: {
    streamId: number;
  };
}

export interface IPreviewReadyAction {
  type: StatsActionTypes.PREVIEW_READY;
  payload: {
    streamId: number;
  };
}

export type StatsAction =
  | IStreamOnlineAction
  | IStreamOfflineAction
  | IPreviewReadyAction;
