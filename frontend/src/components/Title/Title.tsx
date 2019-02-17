import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    title: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.divider}`,
      paddingBottom: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
      height: 40
    }
  });

class Title extends React.Component<WithStyles<typeof styles>> {
  render() {
    const { classes } = this.props;
    return <div className={classes.title}>{this.props.children}</div>;
  }
}

export default withStyles(styles)(Title);
