import { combineEpics, createEpicMiddleware } from 'redux-observable';
import 'rxjs/add/observable/dom/webSocket';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/throttleTime';
import authEpics from './authEpics';
import channelEpics from './channelEpics';
import snackbarEpics from './snackbarEpics';
import socketEpics from './socketEpics';
import streamEpics from './streamEpics';

export const rootEpic = combineEpics(
  authEpics,
  channelEpics,
  streamEpics,
  socketEpics,
  snackbarEpics
);

export default createEpicMiddleware();
