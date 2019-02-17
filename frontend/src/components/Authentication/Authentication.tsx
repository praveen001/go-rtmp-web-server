import {
  createStyles,
  Theme,
  WithStyles,
  withStyles
} from '@material-ui/core/styles';
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import DashboardContainer from '../../containers/DashboardContainer';
import HeaderContainer from '../../containers/HeaderContainer';
import SocketContainer from '../../containers/SocketContainer';
import StreamsContainer from '../../containers/StreamsContainer';
import StreamsLoaderContainer from '../../containers/StreamsLoaderContainer';

const styles = (theme: Theme) =>
  createStyles({
    content: {
      paddingTop: 60
    }
  });

class Authentications extends React.Component<AuthenticationProps> {
  componentDidUpdate() {
    if (!this.props.loading && !this.props.isAuthenticated) {
      this.props.history.replace('/get-started');
    }
  }

  componentWillMount = () => {
    this.init();
  };

  init = () => {
    const token = this.props.token;
    if (token) {
      this.props.authenticateUser(token);
    }
  };

  render = () => {
    const { classes } = this.props;

    if (!this.props.isAuthenticated) {
      return null;
    }

    return (
      <div>
        <HeaderContainer />
        <div className={classes.content}>
          <StreamsLoaderContainer>
            <SocketContainer>
              <Switch>
                <Route
                  path="/streams/:streamId/dashboard"
                  component={DashboardContainer}
                />
                <Route path="/" component={StreamsContainer} />
              </Switch>
            </SocketContainer>
          </StreamsLoaderContainer>
        </div>
      </div>
    );
  };
}

export default withStyles(styles)(Authentications);

export interface IStateProps {
  isAuthenticated: boolean;
  token: string;
  loading: boolean;
  loaded: boolean;
}

export interface IDispatchProps {
  authenticateUser: (token: string) => void;
}

export type AuthenticationProps = IStateProps &
  IDispatchProps &
  RouteComponentProps<{}> &
  WithStyles<typeof styles>;
