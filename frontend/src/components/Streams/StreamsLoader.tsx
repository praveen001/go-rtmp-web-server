import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadStreams } from '../../actions/streamActions';
import { ApiStatus } from '../../models';
import { IState } from '../../reducers';

const StreamsLoader: React.FC = props => {
  const dispatch = useDispatch();
  const loadingStatus = useSelector(
    (state: IState) => state.streams.loadingStatus
  );

  useEffect(() => {
    dispatch(loadStreams());
  }, []);

  if (loadingStatus === ApiStatus.IN_PROGRESS) {
    return <CircularProgress />;
  }
  return <>{props.children}</>;
};

export default StreamsLoader;
