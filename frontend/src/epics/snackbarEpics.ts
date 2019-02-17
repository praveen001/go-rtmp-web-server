import { ActionsObservable, combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import {
  ChannelAction,
  ChannelActionTypes,
  IDeleteChannelFailureAction,
  IDeleteChannelSuccessAction
} from '../actions/channelActions';
import { showSnackbar } from '../actions/snackbarActions';
import {
  ICreateStreamFailureAction,
  ICreateStreamSuccessAction,
  IDeleteStreamFailureAction,
  IDeleteStreamSuccessAction,
  StreamAction,
  StreamActionTypes
} from '../actions/streamActions';

export const createStreamSuccessEpic = (
  action$: ActionsObservable<StreamAction>
) =>
  action$
    .ofType(StreamActionTypes.CREATE_SUCCESS_SUCCESS)
    .map((action: ICreateStreamSuccessAction) =>
      showSnackbar('Stream created successfully', false)
    );

export const createStreamFailureEpic = (
  action$: ActionsObservable<StreamAction>
) =>
  action$
    .ofType(StreamActionTypes.CREATE_STREAM_FAILURE)
    .map((action: ICreateStreamFailureAction) =>
      showSnackbar('Unable to create stream', true)
    );

export const deleteStreamSuccessEpic = (
  action$: ActionsObservable<StreamAction>
) =>
  action$
    .ofType(StreamActionTypes.DELETE_STREAM_SUCCESS)
    .map((action: IDeleteStreamSuccessAction) =>
      showSnackbar('Stream deleted successfully', false)
    );

export const deleteStreamFailureEpic = (
  action$: ActionsObservable<StreamAction>
) =>
  action$
    .ofType(StreamActionTypes.DELETE_STREAM_FAILURE)
    .map((action: IDeleteStreamFailureAction) =>
      showSnackbar('Unable to delete stream', true)
    );

export const deleteChannelSuccessEpic = (
  action$: ActionsObservable<ChannelAction>
) =>
  action$
    .ofType(ChannelActionTypes.DELETE_CHANNEL_SUCCESS)
    .map((action: IDeleteChannelSuccessAction) =>
      showSnackbar('Deleted channel successfully', false)
    );

export const deleteChannelFailureEpic = (
  action$: ActionsObservable<ChannelAction>
) =>
  action$
    .ofType(ChannelActionTypes.DELETE_CHANNEL_FAILURE)
    .map((action: IDeleteChannelFailureAction) =>
      showSnackbar('Unable to delete channel', true)
    );

export default combineEpics(
  createStreamSuccessEpic,
  createStreamFailureEpic,
  deleteStreamSuccessEpic,
  deleteStreamFailureEpic,
  deleteChannelSuccessEpic,
  deleteChannelFailureEpic
);
