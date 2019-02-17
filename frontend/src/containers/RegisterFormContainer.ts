import { connect } from 'react-redux';

// Types
import RegisterForm, {
  IDispatchProps
} from '../components/RegisterForm/RegisterForm';
import { IState } from '../reducers';

// Actions
import { register } from '../actions/authenticationActions';

function mapStateToProps(state: IState) {
  return {};
}

const mapDispatchToProps: IDispatchProps = {
  register
};

export default connect<{}, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(RegisterForm);
