import { connect } from 'react-redux';
import { hideSnackbar } from '../actions/snackbarActions';
import Snackbar, {
  IToastDispatchProps,
  IToastStateProps
} from '../components/Snackbar/Snackbar';
import { IState } from '../reducers';

function mapStateToProps(state: IState): IToastStateProps {
  return {
    toasts: state.snackbar.ids.map(id => state.snackbar.byId[id])
  };
}

const mapDispatchToProps: IToastDispatchProps = {
  hideSnackbar
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Snackbar);
