import React from 'react';

// Material-UI Components
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = (theme: Theme) =>
  createStyles({
    row: {
      marginTop: 25,
      display: 'flex',
      justifyContent: 'space-between'
    }
  });

class RegisterForm extends React.Component<RegisterFormProps> {
  state = {
    name: '',
    email: '',
    password: '',
    rememberMe: false
  };

  changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.target.value });
  };

  changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: e.target.value });
  };

  changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value });
  };

  register = () => {
    const { name, email, password } = this.state;
    this.props.register(name, email, password);
  };

  render() {
    const { classes } = this.props;
    const { name, email, password } = this.state;

    return (
      <>
        <div>
          <TextField
            value={name}
            onChange={this.changeName}
            label="Name"
            fullWidth={true}
          />
        </div>

        <div className={classes.row}>
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
            <Button onClick={this.register} variant="contained" color="primary">
              Register
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(RegisterForm);

export interface IDispatchProps {
  register: (name: string, email: string, password: string) => void;
}

export type RegisterFormProps = IDispatchProps & WithStyles<typeof styles>;
