import { Action } from 'redux';
import { ActionsObservable, combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import axios from '../axios';

import { showSnackbar } from '../actions/snackbarActions';
import {
  createStreamFailure,
  createStreamSuccess,
  deleteStreamFailure,
  deleteStreamSuccess,
  ICreateStreamAction,
  IDeleteStreamAction,
  ILoadStreamsAction,
  loadStreams,
  loadStreamsFailure,
  loadStreamsSuccess,
  StreamAction,
  StreamActionTypes
} from '../actions/streamActions';

export const loadStreamsEpic: Epic<Action> = action$ =>
  action$
    .ofType(StreamActionTypes.LOAD_STREAMS)
    .mergeMap((action: ILoadStreamsAction) =>
      from(axios.get('/streams/list'))
        .mergeMap(response => [loadStreamsSuccess(response.data.data)])
        .catch(() => of(loadStreamsFailure()))
    );

export const createStreamEpic: Epic<Action> = action$ =>
  action$
    .ofType(StreamActionTypes.CREATE_STREAM)
    .mergeMap((action: ICreateStreamAction) =>
      from(axios.post('/streams/add', action.payload))
        .mergeMap(response => [loadStreams(), createStreamSuccess()])
        .catch(() => of(createStreamFailure()))
    );

export const deleteStreamEpic = (action$: ActionsObservable<StreamAction>) =>
  action$
    .ofType(StreamActionTypes.DELETE_STREAM)
    .mergeMap((action: IDeleteStreamAction) =>
      from(axios.delete(`/streams/delete?streamId=${action.payload.streamId}`))
        .mergeMap(response => [deleteStreamSuccess(action.payload.streamId)])
        .catch(() => of(deleteStreamFailure(action.payload.streamId)))
    );

export default combineEpics(
  loadStreamsEpic,
  createStreamEpic,
  deleteStreamEpic
);
