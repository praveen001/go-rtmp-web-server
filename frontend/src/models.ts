export enum ApiStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}

export interface IStream {
  id: number;
  name: string;
  key: string;
  userId: number;
  deleting: ApiStatus;
  url: string;
}
export interface IChannel {
  id: number;
  name: string;
  url: string;
  key: string;
  enabled: boolean;
}

export interface IStats {
  online: boolean;
  previewReady: boolean;
}

export const defaultStats: IStats = {
  online: false,
  previewReady: false
};
