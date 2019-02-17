import { connect } from 'react-redux';

import { loadStreams } from '../actions/streamActions';
import StreamsLoader, {
  IStreamsLoaderDispatchProps,
  IStreamsLoaderStateProps
} from '../components/Streams/StreamsLoader';
import { IState } from '../reducers';

function mapStateToProps(state: IState): IStreamsLoaderStateProps {
  return {
    loadingStatus: state.streams.loadingStatus
  };
}

const mapDispatchToProps: IStreamsLoaderDispatchProps = {
  loadStreams
};

export default connect<IStreamsLoaderStateProps, IStreamsLoaderDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(StreamsLoader);
