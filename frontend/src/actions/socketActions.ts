export enum SocketActionTypes {
  CONNECT = 'socket/CONNECT',
  CONNECTED = 'socket/CONNECTED',
  RECEIVE_MESSAGE = 'socket/RECEIVE_MESSAGE',
  SEND_MESSAGE = 'socket/SEND_MESSAGE',
  SENT_MESSAGE = 'socket/SENT_MESSAGE',
  DISCONNECT = 'socket/DISCONNECT',
  DISCONNECTED = 'socket/DISCONNECTED'
}

export function connect(url: string): IConnectAction {
  return {
    type: SocketActionTypes.CONNECT,
    payload: {
      url
    }
  };
}

export function connected(): IConnectedAction {
  return { type: SocketActionTypes.CONNECTED };
}

export function receiveMessage(msg: any): IReceiveMessageAction {
  if (msg.type) {
    return msg;
  }
  return { type: SocketActionTypes.RECEIVE_MESSAGE, payload: msg };
}

export function sendMessage(msg: any): ISendMessageAction {
  return { type: SocketActionTypes.SEND_MESSAGE, payload: { msg } };
}

export function sentMessage(): ISentMessageAction {
  return { type: SocketActionTypes.SENT_MESSAGE };
}

export function disconnect(): IDisconnectAction {
  return { type: SocketActionTypes.DISCONNECT };
}

export function disconnected(): IDisconnectedAction {
  return { type: SocketActionTypes.DISCONNECTED };
}

export interface IConnectAction {
  type: SocketActionTypes.CONNECT;
  payload: {
    url: string;
  };
}

export interface IConnectedAction {
  type: SocketActionTypes.CONNECTED;
}

export interface IReceiveMessageAction {
  type: SocketActionTypes.RECEIVE_MESSAGE;
  payload: {
    msg: any;
  };
}

export interface ISendMessageAction {
  type: SocketActionTypes.SEND_MESSAGE;
  payload: {
    msg: any;
  };
}

export interface ISentMessageAction {
  type: SocketActionTypes.SENT_MESSAGE;
}

export interface IDisconnectAction {
  type: SocketActionTypes.DISCONNECT;
}

export interface IDisconnectedAction {
  type: SocketActionTypes.DISCONNECTED;
}

export type SocketAction =
  | IConnectAction
  | IConnectedAction
  | IReceiveMessageAction
  | ISendMessageAction
  | IDisconnectAction
  | IDisconnectedAction;
