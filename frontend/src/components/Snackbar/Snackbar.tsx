import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import classNames from 'classnames';
import React from 'react';
import { IToast } from '../../reducers/snackbarReducer';

const styles = (theme: Theme) =>
  createStyles({
    closeButton: {
      padding: theme.spacing.unit / 2
    },
    error: {
      background: 'red'
    }
  });

class Toast extends React.Component<ToastProps> {
  hideSnackbar = (id: number) => e => {
    this.props.hideSnackbar(id);
  };

  getActions = (toast: IToast) => {
    const { classes } = this.props;

    return (
      <div>
        <IconButton
          color="inherit"
          onClick={this.hideSnackbar(toast.id)}
          className={classes.closeButton}
        >
          <CloseIcon />
        </IconButton>
      </div>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 2000 }}>
        {this.props.toasts.map(toast => (
          <Snackbar
            key={toast.id}
            open={true}
            ClickAwayListenerProps={{
              mouseEvent: false
            }}
            onClose={this.hideSnackbar(toast.id)}
            style={{
              position: 'static',
              marginTop: 16,
              transform: 'none'
            }}
            autoHideDuration={5000}
          >
            <SnackbarContent
              className={classNames({ [classes.error]: toast.error })}
              message={<div>{toast.message}</div>}
              action={this.getActions(toast)}
            />
          </Snackbar>
        ))}
      </div>
    );
  }
}

export interface IToastStateProps {
  toasts: IToast[];
}

export interface IToastDispatchProps {
  hideSnackbar: (id: number) => void;
}

type ToastProps = IToastStateProps &
  IToastDispatchProps &
  WithStyles<typeof styles>;

export default withStyles(styles)(Toast);
