import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles
} from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import AddChannelContainer from '../../containers/AddChannelContainer';
import { IChannel, IStats, IStream } from '../../models';
import Twitch from '../Icons/Twitch';
import Youtube from '../Icons/Youtube';
import VideoPlayer from '../Player/Player';
import StreamStatusIcon from '../StreamStatusIcon/StreamStatusIcon';
import Title from '../Title/Title';
import { BaseUrl } from '../../config';

const styles = (theme: Theme) =>
  createStyles({
    wrap: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    streamStatus: {
      padding: theme.spacing.unit,
      display: 'flex',
      alignItems: 'center'
    },
    content: {
      display: 'flex',
      paddingTop: theme.spacing.unit,
      flex: 1
    },
    main: {
      flex: 1,
      marginRight: theme.spacing.unit,
      padding: theme.spacing.unit
    },
    sidebar: {
      width: '20%',
      padding: theme.spacing.unit,
      minWidth: 300
    },
    channel: {
      background: theme.palette.divider,
      borderRadius: 4,
      padding: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    channelInfo: {
      display: 'flex'
    },
    logo: {
      padding: 10,
      '& > svg': {
        width: 100
      }
    },
    player: {
      background: '#000',
      height: 200,
      width: '100%',
      marginBottom: 30,
      '& > video': {
        width: '100%',
        height: '100%'
      }
    },
    row: {
      marginBottom: 30
    }
  });

const iconMap = {
  youtube: <Youtube />,
  twitch: <Twitch />
};

class Dashboard extends React.Component<DashboardProps, IDashboardState> {
  streamKeyInput: HTMLInputElement;
  state = {
    showStreamKey: false
  };

  componentDidMount() {
    this.props.selectStream(this.props.match.params.streamId);
    this.props.fetchChannelList(this.props.match.params.streamId);
  }

  deleteChannel = (channelId: number) => () => {
    this.props.deleteChannel(this.props.stream.id, channelId);
  };

  showStreamKey = () => {
    this.setState({
      showStreamKey: !this.state.showStreamKey
    });
  };

  copyStreamKey = () => {
    const el = document.createElement('textarea');
    el.value = this.props.stream.key;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.props.showSnackbar('Stream key copied to clipboard', false);
  };

  getOptions = () => {
    const videoJsOptions = {
      autoplay: true,
      controls: false,
      muted: true,
      sources: [
        {
          src: `${BaseUrl}/hls/${this.props.stream.key}/index.m3u8`,
          type: 'application/x-mpegURL'
        }
      ]
    };

    return videoJsOptions;
  };

  render = () => {
    const { classes, stream, channels, stats, showAddChannel } = this.props;

    if (!this.props.stream) {
      return <CircularProgress />;
    }

    return (
      <div>
        <AddChannelContainer />
        <div className={classes.wrap}>
          <Paper className={classes.streamStatus}>
            <StreamStatusIcon online={stats.online} />
            <Typography variant="button">
              {stats.online ? 'Online' : 'Offline'}
            </Typography>
          </Paper>
          <div className={classes.content}>
            <Paper className={classes.main}>
              <Title>
                <Typography variant="button">Channels</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={showAddChannel}
                >
                  Add Channel
                </Button>
              </Title>
              {channels.map(channel => (
                <div className={classes.channel} key={channel.id}>
                  <div className={classes.channelInfo}>
                    <div className={classes.logo}>
                      {iconMap[channel.name.toLowerCase()]}
                    </div>
                    <div>
                      <Typography variant="button">{channel.name}</Typography>
                      <Typography variant="caption">{channel.key}</Typography>
                    </div>
                  </div>
                  <div>
                    <Switch checked={channel.enabled} />
                    <IconButton onClick={this.deleteChannel(channel.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
            </Paper>
            <Paper className={classes.sidebar}>
              <div className={classes.player}>
                {stats.previewReady ? (
                  <VideoPlayer {...this.getOptions()} />
                ) : (
                  'No Url Configured'
                )}
              </div>
              <div className={classes.row}>
                <TextField
                  label="RTMP Stream URL"
                  value="rtmp://localhost/live2"
                  fullWidth
                />
              </div>
              <div className={classes.row}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="adornment-stream-key">
                    RTMP Stream Key
                  </InputLabel>
                  <Input
                    id="adornment-stream-key"
                    type={this.state.showStreamKey ? 'text' : 'password'}
                    value={this.props.stream.key || ''}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle stream key visibility"
                          onClick={this.showStreamKey}
                        >
                          {this.state.showStreamKey ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                        <IconButton onClick={this.copyStreamKey}>
                          <CopyIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
            </Paper>
          </div>
        </div>
      </div>
    );
  };
}

/* tslint:disable */
function CopyIcon(props) {
  return (
    <SvgIcon width="24" height="24" viewBox="0 0 24 24">
      <path
        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
        fill="inherit"
      />
    </SvgIcon>
  );
}
/* tslint:enable */

export default withStyles(styles)(withRouter(Dashboard));

export interface IStateProps {
  token: string;
  stream: IStream;
  stats: IStats;
  channels: IChannel[];
}

export interface IDispatchProps {
  showAddChannel: () => {};
  fetchChannelList: (streamId: string) => {};
  selectStream: (streamId: string) => {};
  deleteChannel: (streamId: number, channelId: number) => {};
  showSnackbar: (message: string, error: boolean) => {};
}

export interface IDashboardRouteProps {
  streamId: string;
}

export interface IDashboardState {
  showStreamKey: boolean;
}

export type DashboardProps = IStateProps &
  IDispatchProps &
  WithStyles<typeof styles> &
  RouteComponentProps<IDashboardRouteProps>;
