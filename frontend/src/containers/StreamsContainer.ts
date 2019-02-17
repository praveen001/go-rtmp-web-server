import { connect } from 'react-redux';

import {
  deleteStream,
  loadStreams,
  openNewStreamDialog
} from '../actions/streamActions';
import Streams, {
  IStreamsDispatchProps,
  IStreamsStateProps
} from '../components/Streams/Streams';
import { IState } from '../reducers';

function mapStateToProps(state: IState): IStreamsStateProps {
  return {
    streams: state.streams.ids.map(id => state.streams.byId[id]),
    statsById: state.stats.byId
  };
}

const mapDispatchToProps: IStreamsDispatchProps = {
  openNewStreamDialog,
  deleteStream
};

export default connect<IStreamsStateProps, IStreamsDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(Streams);
