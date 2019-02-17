import { connect } from 'react-redux';

// Types
import LoginForm, { IDispatchProps } from '../components/LoginForm/LoginForm';
import { IState } from '../reducers';

// Actions
import { login } from '../actions/authenticationActions';

function mapStateToProps(state: IState) {
  return {};
}

const mapDispatchToProps: IDispatchProps = {
  login
};

export default connect<{}, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);
