import createMuiTheme, { Theme } from '@material-ui/core/styles/createMuiTheme';

export default (type: any) => {
  return createMuiTheme({
    palette: {
      type: type as 'light' | 'dark',
      primary: {
        main: '#02444e'
      },
      secondary: {
        main: '#15ac02'
      },
      text: {
        primary: type === 'light' ? '#363f45' : '#ddd',
        secondary: type === 'light' ? '#525e66' : '#ccc'
      },
      error: {
        main: '#df041f'
      }
    },
    transitions: {
      duration: {
        leavingScreen: 200,
        enteringScreen: 200
      }
    },
    typography: {
      useNextVariants: true
    }
  });
};

/* tslint:disable */
interface ICustomTheme {}

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme extends ICustomTheme {}
  interface ThemeOptions extends ICustomTheme {}
}
/* tslint:enable */
