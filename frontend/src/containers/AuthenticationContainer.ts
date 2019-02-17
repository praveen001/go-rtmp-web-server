import { connect } from 'react-redux';

// Types
import Authentication, {
  IDispatchProps,
  IStateProps
} from '../components/Authentication/Authentication';
import { IState } from '../reducers';

// Actions
import { withRouter } from 'react-router';
import { authenticateUser } from '../actions/authenticationActions';

function mapStateToProps(state: IState): IStateProps {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    token: state.auth.token,
    loading: state.auth.loading,
    loaded: state.auth.loaded
  };
}

const mapDispatchToProps: IDispatchProps = {
  authenticateUser
};

export default withRouter(
  connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(Authentication)
);
