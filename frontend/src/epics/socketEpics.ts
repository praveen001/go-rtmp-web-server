import { Action } from 'redux';
import { ActionsObservable, combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {
  connect,
  connected,
  disconnected,
  IConnectAction,
  ISendMessageAction,
  receiveMessage,
  sentMessage,
  SocketActionTypes
} from '../actions/socketActions';

let webSocketSubject: WebSocketSubject<any>;
let onOpenSubject = new Subject();
let onCloseSubject = new Subject();

const connectSocket = websocketUrl => {
  onOpenSubject = new Subject();
  onCloseSubject = new Subject();
  webSocketSubject = webSocket({
    url: websocketUrl,
    openObserver: onOpenSubject,
    closeObserver: onCloseSubject
  });
  return webSocketSubject;
};

const connectEpic = (action$: ActionsObservable<Action>) =>
  action$
    .ofType(SocketActionTypes.CONNECT)
    .switchMap((action: IConnectAction) =>
      connectSocket(action.payload.url)
        .catch(() =>
          of(connect(action.payload.url))
            .delay(5000)
            .startWith(disconnected())
        )
        .map(data => {
          const { type, ...payload } = data;
          return {
            type,
            payload
          };
        })
    );

const connectedEpic = (action$: ActionsObservable<Action>) =>
  action$
    .ofType(SocketActionTypes.CONNECT)
    .switchMap(() => onOpenSubject.mapTo(connected()));

const sendMessageEpic = (action$: ActionsObservable<Action>) =>
  action$
    .ofType(SocketActionTypes.SEND_MESSAGE)
    .map((action: ISendMessageAction) => {
      webSocketSubject.next(action.payload.msg);
      return sentMessage();
    });

const disconnectEpic = (action$: ActionsObservable<Action>) =>
  action$.ofType(SocketActionTypes.DISCONNECT).map(() => {
    webSocketSubject.complete();
    return disconnected();
  });

export default combineEpics(
  connectEpic,
  connectedEpic,
  sendMessageEpic,
  disconnectEpic
);
