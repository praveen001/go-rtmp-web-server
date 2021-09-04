import { connect } from 'react-redux';

// Types
import AddChannelForm, {
  IDispatchProps,
  IOwnProps
} from '../components/AddChannelForm/AddChannelForm';
import { IState } from '../reducers';

// Actions
import { addChannel } from '../actions/channelActions';

function mapStateToProps(state: IState) {
  return {
    streamId: state.streams.streamId
  };
}

const mapDispatchToProps: IDispatchProps = {
  addChannel
};

export default connect<IOwnProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(AddChannelForm);
