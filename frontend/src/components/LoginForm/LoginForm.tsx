import React from 'react';

// Material-UI Components
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const styles = (theme: Theme) =>
  createStyles({
    row: {
      marginTop: 25,
      display: 'flex',
      justifyContent: 'space-between'
    }
  });

class LoginForm extends React.Component<LoginFormProps> {
  state = {
    email: '',
    password: '',
    rememberMe: false
  };

  changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: e.target.value });
  };

  changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value });
  };

  changeRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ rememberMe: e.target.checked });
  };

  login = () => {
    const { email, password, rememberMe } = this.state;
    this.props.login(email, password, rememberMe);
  };

  render() {
    const { classes } = this.props;
    const { email, password, rememberMe } = this.state;

    return (
      <>
        <div>
          <TextField
            value={email}
            onChange={this.changeEmail}
            label="Email"
            fullWidth={true}
          />
        </div>

        <div className={classes.row}>
          <TextField
            type="password"
            value={password}
            onChange={this.changePassword}
            label="Password"
            fullWidth={true}
          />
        </div>

        <div className={classes.row}>
          <div>
            <Button onClick={this.login} variant="contained" color="primary">
              Login
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(LoginForm);

export interface IDispatchProps {
  login: (email: string, password: string, shouldRemember: boolean) => void;
}

export type LoginFormProps = IDispatchProps & WithStyles<typeof styles>;
