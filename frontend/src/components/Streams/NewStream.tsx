import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { ApiStatus } from '../../models';
import Title from '../Title/Title';

const styles = (theme: Theme) =>
  createStyles({
    content: {
      padding: theme.spacing.unit,
      display: 'flex',
      flexDirection: 'column'
    },
    row: {
      marginBottom: 25
    }
  });

class NewStream extends React.Component<NewStreamProps> {
  state = {
    name: ''
  };

  onChange = e => {
    this.setState({
      name: e.target.value
    });
  };

  createStream = () => {
    this.props.createStream(this.state.name);
  };

  getContent = () => {
    const { loadingStatus, closeNewStreamDialog, classes } = this.props;

    if (loadingStatus === ApiStatus.IN_PROGRESS) {
      return <CircularProgress />;
    }

    return (
      <>
        <Title>
          <Typography variant="button">Create Stream</Typography>
          <IconButton onClick={closeNewStreamDialog}>
            <CloseIcon />
          </IconButton>
        </Title>
        <div className={classes.row}>
          <TextField
            label="Stream Name"
            value={this.state.name}
            onChange={this.onChange}
            fullWidth
          />
        </div>
        <Button variant="contained" color="primary" onClick={this.createStream}>
          Create Stream
        </Button>
      </>
    );
  };

  render() {
    const { classes, open, closeNewStreamDialog } = this.props;

    return (
      <Dialog
        open={open}
        onClose={closeNewStreamDialog}
        maxWidth="sm"
        fullWidth
      >
        <div className={classes.content}>{this.getContent()}</div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(NewStream);

export interface INewStreamStateProps {
  open: boolean;
  loadingStatus: ApiStatus;
}

export interface INewStreamDispatchProps {
  closeNewStreamDialog: () => {};
  createStream: (name: string) => {};
}

type NewStreamProps = INewStreamStateProps &
  INewStreamDispatchProps &
  WithStyles<typeof styles>;
