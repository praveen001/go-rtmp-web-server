import { connect } from 'react-redux';

import {
  connect as connectToSocket,
  disconnect
} from '../actions/socketActions';
import Socket, {
  ISocketDispatchProps,
  ISocketStateProps
} from '../components/Socket/Socket';
import { IState } from '../reducers';

function mapStateToProps(state: IState): ISocketStateProps {
  return {
    token: state.auth.token,
    status: state.socket.status,
    wasConnected: state.socket.wasConnected
  };
}

const mapDispatchToProps: ISocketDispatchProps = {
  connect: connectToSocket,
  disconnect
};

export default connect<ISocketDispatchProps, ISocketStateProps>(
  mapStateToProps,
  mapDispatchToProps
)(Socket);
