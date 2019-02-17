import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import React from 'react';
import NewStreamContainer from '../../containers/NewStreamContainer';
import { ApiStatus, IStats, IStream } from '../../models';
import VideoPlayer from '../Player/Player';
import Title from '../Title/Title';

const styles = (theme: Theme) =>
  createStyles({
    wrap: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > :nth-child(3n)': {
        paddingRight: 0
      }
    },
    streamWrap: {
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      width: `33.3%`
    },
    stream: {
      padding: theme.spacing.unit
    },
    streamOnline: {
      border: '1px solid green'
    },
    player: {
      background: '#000',
      height: 250,
      width: '100%',
      marginBottom: theme.spacing.unit
    },
    controls: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    actions: {
      display: 'flex',
      '& > *': {
        marginLeft: theme.spacing.unit
      }
    }
  });

class Streams extends React.Component<StreamsProps> {
  deleteStream = (streamId: number) => () => {
    this.props.deleteStream(streamId);
  };

  getOptions = (stream: IStream) => {
    const videoJsOptions = {
      autoplay: true,
      controls: false,
      muted: true,
      sources: [
        {
          src: `/hls/${stream.key}/index.m3u8`,
          type: 'application/x-mpegURL'
        }
      ]
    };

    return videoJsOptions;
  };

  render() {
    const { classes, streams, statsById, openNewStreamDialog } = this.props;

    return (
      <div>
        <Title>
          <Typography variant="button">My Streams</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={openNewStreamDialog}
          >
            Add Stream
          </Button>
        </Title>
        <div className={classes.wrap}>
          {streams.map(stream => (
            <div className={classes.streamWrap} key={stream.id}>
              <Paper
                key={stream.id}
                className={classnames(classes.stream, {
                  [classes.streamOnline]: (statsById[stream.id] || ({} as any))
                    .online
                })}
              >
                <div className={classes.player}>
                  {statsById[stream.id] && statsById[stream.id].online && (
                    <VideoPlayer {...this.getOptions(stream)} />
                  )}
                </div>
                <div className={classes.controls}>
                  <Typography>{stream.name}</Typography>
                  <div className={classes.actions}>
                    <Button
                      href={`/streams/${stream.id}/dashboard`}
                      color="primary"
                      variant="contained"
                      size="small"
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={this.deleteStream(stream.id)}
                      disabled={stream.deleting === ApiStatus.IN_PROGRESS}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Paper>
            </div>
          ))}
        </div>
        <NewStreamContainer />
      </div>
    );
  }
}

export default withStyles(styles)(Streams);

export interface IStreamsStateProps {
  streams: IStream[];
  statsById: { [key: number]: IStats };
}

export interface IStreamsDispatchProps {
  openNewStreamDialog: () => {};
  deleteStream: (streamId: number) => void;
}

type StreamsProps = IStreamsStateProps &
  IStreamsDispatchProps &
  WithStyles<typeof styles>;
