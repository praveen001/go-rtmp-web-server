import { connect } from 'react-redux';

import { closeNewStreamDialog, createStream } from '../actions/streamActions';
import NewStream, {
  INewStreamDispatchProps,
  INewStreamStateProps
} from '../components/Streams/NewStream';
import { IState } from '../reducers';

function mapStateToProps(state: IState): INewStreamStateProps {
  return {
    open: state.streams.open,
    loadingStatus: state.streams.addingStatus
  };
}

const mapDispatchToProps: INewStreamDispatchProps = {
  closeNewStreamDialog,
  createStream
};

export default connect<INewStreamStateProps, INewStreamDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(NewStream);
