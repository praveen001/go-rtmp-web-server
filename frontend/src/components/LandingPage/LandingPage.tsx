import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import LoginFormContainer from '../../containers/LoginFormContainer';
import RegisterFormContainer from '../../containers/RegisterFormContainer';

const styles = (theme: Theme) =>
  createStyles({
    form: {
      height: '90%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    paper: {
      width: 350,
      padding: 0
    },
    content: {
      padding: theme.spacing.unit * 2
    }
  });

class LandingPage extends React.Component<WithStyles<typeof styles>> {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.form}>
        <Paper className={classes.paper}>
          <AppBar position="static">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
          </AppBar>
          <div className={classes.content}>
            {value === 0 && <LoginFormContainer />}
            {value === 1 && <RegisterFormContainer />}
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(LandingPage);
