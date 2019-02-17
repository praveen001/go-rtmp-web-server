import { connect } from 'react-redux';
import { logout } from '../actions/authenticationActions';
import { closeMenu, openMenu } from '../actions/headerActions';
import { toggleTheme } from '../actions/themeActions';
import Header, {
  IHeaderDispatchProps,
  IHeaderStateProps
} from '../components/Header/Header';
import { IState } from '../reducers';

function mapStateToProps(state: IState): IHeaderStateProps {
  return {
    open: state.header.open,
    user: state.auth.user,
    theme: state.theme.type
  };
}

const mapDispatchToProps: IHeaderDispatchProps = {
  openMenu,
  closeMenu,
  toggleTheme,
  logout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
