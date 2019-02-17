import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import classnames from 'classnames';
import React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    status: {
      width: 20,
      height: 20,
      borderRadius: 30,
      marginRight: theme.spacing.unit
    },
    offline: {
      background: '#888'
    },
    online: {
      background: 'green'
    }
  });

class StreamStatusIcon extends React.Component<StreamStatusIconProps> {
  render() {
    const { classes, online } = this.props;

    return (
      <div
        className={classnames(classes.status, {
          [classes.offline]: !online,
          [classes.online]: online
        })}
      />
    );
  }
}

export default withStyles(styles)(StreamStatusIcon);

interface IStreamStatusIconOwnProps {
  online: boolean;
}

type StreamStatusIconProps = IStreamStatusIconOwnProps &
  WithStyles<typeof styles>;
