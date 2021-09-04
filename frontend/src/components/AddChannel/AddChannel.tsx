import ButtonBase from '@material-ui/core/ButtonBase';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { BaseUrl } from '../../config';
import ChannelContainer from '../../containers/ChannelContainer';
import Facebook from '../Icons/Facebook';
import Periscope from '../Icons/Periscope';
import Twitch from '../Icons/Twitch';
import Youtube from '../Icons/Youtube';
import Title from '../Title/Title';

const styles = (theme: Theme) =>
  createStyles({
    dialog: {
      padding: theme.spacing.unit
    },
    wrap: {
      display: 'flex',
      padding: theme.spacing.unit
    },
    channelListWrap: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    channelList: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    channelTile: {
      width: 150,
      height: 120,
      background: '#333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      color: '#fff',
      margin: theme.spacing.unit
    },
    logo: {
      width: '100%'
    },
    title: {
      flex: 1
    }
  });

class AddChannel extends React.Component<AddChannelProps> {
  add = (name: string) => () => {
    window.location.replace(
      `${BaseUrl}/channels/${name}?streamId=${this.props.streamId}`
    );
  };

  render() {
    const { classes, open, hideAddChannel } = this.props;

    return (
      <Dialog
        open={open}
        onClose={hideAddChannel}
        maxWidth="md"
        fullWidth
        classes={{
          paper: classes.dialog
        }}
      >
        <Title>
          <Typography variant="button">Add Channel</Typography>
          <IconButton onClick={hideAddChannel}>
            <CloseIcon />
          </IconButton>
        </Title>
        <div className={classes.wrap}>
          <ChannelContainer />
          <div className={classes.channelListWrap}>
            <Typography variant="h6" className={classes.title}>
              Choose from
            </Typography>
            <br />
            <div className={classes.channelList}>
              <ButtonBase
                className={classes.channelTile}
                onClick={this.add('youtube')}
              >
                <Youtube className={classes.logo} />
                <Typography variant="caption" color="inherit">
                  Youtube
                </Typography>
              </ButtonBase>
              <ButtonBase
                className={classes.channelTile}
                onClick={this.add('twitch')}
              >
                <Twitch className={classes.logo} />
                <Typography variant="caption" color="inherit">
                  Twitch
                </Typography>
              </ButtonBase>
              <ButtonBase
                className={classes.channelTile}
                onClick={this.add('facebook')}
              >
                <Facebook className={classes.logo} />
                <Typography variant="caption" color="inherit">
                  Facebook
                </Typography>
              </ButtonBase>
              <ButtonBase
                className={classes.channelTile}
                onClick={this.add('periscope')}
              >
                <Periscope className={classes.logo} />
                <Typography variant="caption" color="inherit">
                  Periscope
                </Typography>
              </ButtonBase>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(AddChannel);

export interface IAddChannelStatusProps {
  open: boolean;
  streamId: number;
}

export interface IAddChannelDispatchProps {
  hideAddChannel: () => {};
}

type AddChannelProps = IAddChannelStatusProps &
  IAddChannelDispatchProps &
  WithStyles<typeof styles>;
