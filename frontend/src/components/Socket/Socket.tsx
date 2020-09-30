import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect, disconnect } from '../../actions/socketActions';
import { SocketUrl } from '../../config';
import { ApiStatus } from '../../models';
import { IState } from '../../reducers';

const WebSocket: React.FC = props => {
  const dispatch = useDispatch();
  const { status, wasConnected, token } = useSelector((state: IState) => ({
    status: state.socket.status,
    wasConnected: state.socket.wasConnected,
    token: state.auth.token
  }));

  useEffect(() => {
    dispatch(connect(`${SocketUrl}/ws/connect?token=${token}`));
    return () => dispatch(disconnect());
  }, []);

  if (status === ApiStatus.IN_PROGRESS) {
    return <CircularProgress />;
  }
  if (status === ApiStatus.FAILURE) {
    return <div>Unable to connect to websocket server</div>;
  }
  if (status === ApiStatus.SUCCESS) {
    return <>{props.children}</>;
  }
  return null;
};

export default WebSocket;
