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
    addChannelForm: {
      height: '90%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    paper: {
      width: 350,
      padding: theme.spacing.unit * 2
    },
    row: {
      marginTop: 25,
      display: 'flex',
      justifyContent: 'space-between'
    }
  });

class AddChannelForm extends React.Component<AddChannelFormProps> {
  state = {
    name: '',
    url: '',
    key: ''
  };

  changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.target.value });
  };

  changeURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ url: e.target.value });
  };

  changeKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ key: e.target.value });
  };

  addChannel = () => {
    const { name, url, key } = this.state;
    this.props.addChannel(name, url, key);
  };

  render() {
    const { classes } = this.props;
    const { name, url, key } = this.state;

    return (
      <div className={classes.addChannelForm}>
        <Paper className={classes.paper}>
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
              value={url}
              onChange={this.changeURL}
              label="Url"
              fullWidth={true}
            />
          </div>

          <div className={classes.row}>
            <TextField
              type="password"
              value={key}
              onChange={this.changeKey}
              label="Stream Key"
              fullWidth={true}
            />
          </div>

          <div className={classes.row}>
            <div>
              <Button
                onClick={this.addChannel}
                variant="contained"
                color="primary"
              >
                Add Channel
              </Button>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(AddChannelForm);

export interface IDispatchProps {
  addChannel: (name: string, url: string, key: string) => void;
}

export type AddChannelFormProps = IDispatchProps & WithStyles<typeof styles>;
