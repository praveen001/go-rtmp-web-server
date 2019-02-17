import { connect } from 'react-redux';
import Theme, { IThemeStateProps } from '../components/Theme/Theme';
import { IState } from '../reducers';

function mapStateToProps(state: IState): IThemeStateProps {
  return {
    type: state.theme.type
  };
}

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Theme);
