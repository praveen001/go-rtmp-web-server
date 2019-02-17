import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';
import { ApiStatus } from '../../models';

class StreamsLoader extends React.Component<StreamsLoaderProps> {
  componentDidMount() {
    this.props.loadStreams();
  }

  render() {
    if (this.props.loadingStatus === ApiStatus.IN_PROGRESS) {
      return <CircularProgress />;
    }
    return this.props.children;
  }
}

export default StreamsLoader;

export interface IStreamsLoaderStateProps {
  loadingStatus: ApiStatus;
}

export interface IStreamsLoaderDispatchProps {
  loadStreams: () => {};
}

type StreamsLoaderProps = IStreamsLoaderStateProps &
  IStreamsLoaderDispatchProps;
