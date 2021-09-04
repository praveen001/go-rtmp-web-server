import { connect } from 'react-redux';

// Types
import AddChannelForm, {
  IDispatchProps
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

export default connect<{}, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(AddChannelForm);
