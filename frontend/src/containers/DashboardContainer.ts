import { connect } from 'react-redux';

// Types
import Dashboard, {
  IDispatchProps,
  IStateProps
} from '../components/Dashboard/Dashboard';
import { IState } from '../reducers';

// Actions
import {
  addChannel,
  deleteChannel,
  fetchChannelList,
  showAddChannel
} from '../actions/channelActions';
import { showSnackbar } from '../actions/snackbarActions';
import { selectStream } from '../actions/streamActions';
import { defaultStats, IStats } from '../models';

function mapStateToProps(state: IState): IStateProps {
  return {
    token: state.auth.token,
    stream: state.streams.byId[state.streams.streamId],
    stats: state.stats.byId[state.streams.streamId] || defaultStats,
    channels: state.channels.ids.map(id => state.channels.byId[id])
  };
}

const mapDispatchToProps: IDispatchProps = {
  showAddChannel,
  fetchChannelList,
  selectStream,
  deleteChannel,
  showSnackbar
};

export default connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
