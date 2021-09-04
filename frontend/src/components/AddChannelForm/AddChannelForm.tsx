import React from 'react';

// Material-UI Components
import Button from '@material-ui/core/Button';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = (theme: Theme) =>
  createStyles({
    addChannelForm: {
      display: 'flex',
      flexDirection: 'column',
      width: 450,
      padding: theme.spacing.unit * 1,
      paddingRight: 35,
      marginRight: 20,
      borderRight: `1px solid ${theme.palette.divider}`
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
    this.props.addChannel(this.props.streamId, name, url, key);
  };

  render() {
    const { classes } = this.props;
    const { name, url, key } = this.state;

    return (
      <div className={classes.addChannelForm}>
        <Typography variant="h6">Add Custom RTMP Endpoint</Typography>
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
            label="Server"
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
      </div>
    );
  }
}

export default withStyles(styles)(AddChannelForm);

export interface IOwnProps {
  streamId: number;
}

export interface IDispatchProps {
  addChannel: (
    streamId: string,
    name: string,
    url: string,
    key: string
  ) => void;
}

export type AddChannelFormProps = IOwnProps &
  IDispatchProps &
  WithStyles<typeof styles>;
