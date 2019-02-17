import { connect } from 'react-redux';
import { hideAddChannel } from '../actions/channelActions';
import AddChannel, {
  IAddChannelDispatchProps,
  IAddChannelStatusProps
} from '../components/AddChannel/AddChannel';
import { IState } from '../reducers';

function mapStateToProps(state: IState): IAddChannelStatusProps {
  return {
    open: state.channels.addChannelOpen,
    streamId: state.streams.streamId
  };
}

const mapDispatchToProps: IAddChannelDispatchProps = {
  hideAddChannel
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddChannel);
