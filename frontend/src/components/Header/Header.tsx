import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      color: '#fff'
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    logo: {
      textTransform: 'none'
    }
  });

class Header extends React.Component<HeaderProps> {
  anchorEl;

  openMenu = e => {
    this.anchorEl = e.target;
    this.props.openMenu();
  };

  closeMenu = () => {
    this.anchorEl = undefined;
    this.props.closeMenu();
  };

  render() {
    const { classes, theme, toggleTheme, logout } = this.props;

    const darkTheme = theme === 'dark';

    return (
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Button href="/streams" className={classes.logo} color="inherit">
            <Typography variant="h5" color="inherit">
              Restream
            </Typography>
          </Button>
          <div>
            <Button
              aria-owns={this.anchorEl ? 'simple-menu' : undefined}
              aria-haspopup="true"
              onClick={this.openMenu}
              color="inherit"
            >
              {this.props.user.name}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.anchorEl}
              open={Boolean(this.anchorEl)}
              onClose={this.closeMenu}
            >
              <MenuItem onClick={toggleTheme}>
                <FormControlLabel
                  style={{ pointerEvents: 'none' }}
                  control={<Switch checked={darkTheme} />}
                  label="Dark Theme"
                />
              </MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);

export interface IHeaderStateProps {
  open: boolean;
  user: any;
  theme: string;
}

export interface IHeaderDispatchProps {
  openMenu: () => {};
  closeMenu: () => {};
  toggleTheme: () => {};
  logout: () => {};
}

type HeaderProps = IHeaderStateProps &
  IHeaderDispatchProps &
  WithStyles<typeof styles>;
