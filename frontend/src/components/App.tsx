import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// Material-UI Components
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';

// Components/Containers
import { ConnectedRouter } from 'connected-react-router';
import AuthenticationContainer from '../containers/AuthenticationContainer';
import SnackbarContainer from '../containers/SnackbarContainer';
import { history } from '../reducers';
import LandingPage from './LandingPage/LandingPage';

const styles = (theme: Theme) =>
  createStyles({
    content: {
      padding: theme.spacing.unit * 2,
      height: '100%',
      width: '100%'
    }
  });

class App extends React.Component<AppProps> {
  render() {
    const { classes } = this.props;

    return (
      <ConnectedRouter history={history}>
        <div className={classes.content}>
          <Switch>
            <Route path="/get-started" component={LandingPage} />
            <Route path="/streams" component={AuthenticationContainer} />
            <Redirect to="/get-started" />
          </Switch>
          <SnackbarContainer />
        </div>
      </ConnectedRouter>
    );
  }
}

export default withStyles(styles)(App);

export type AppProps = WithStyles<typeof styles>;
