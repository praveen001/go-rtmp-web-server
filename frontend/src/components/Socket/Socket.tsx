import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';
import { SocketUrl } from '../../config';
import { ApiStatus } from '../../models';

class Websocket extends React.Component<SocketProps> {
  componentDidMount() {
    this.props.connect(`${SocketUrl}/ws/connect?token=${this.props.token}`);
  }

  componentWillUnmount() {
    this.props.disconnect();
  }

  render() {
    if (this.props.status === ApiStatus.IN_PROGRESS) {
      return <CircularProgress />;
    }
    if (this.props.status === ApiStatus.FAILURE) {
      return <div>Unable to connect to websocket server</div>;
    }
    if (this.props.status === ApiStatus.SUCCESS) {
      return this.props.children;
    }
    return null;
  }
}

export interface ISocketStateProps {
  status: ApiStatus;
  wasConnected: boolean;
  token: string;
}

export interface ISocketDispatchProps {
  connect: (url: string) => {};
  disconnect: () => {};
}

type SocketProps = ISocketStateProps & ISocketDispatchProps;

export default Websocket;
