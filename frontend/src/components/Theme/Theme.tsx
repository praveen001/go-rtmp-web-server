import { MuiThemeProvider, Theme } from '@material-ui/core/styles';
import React from 'react';

import themeCreator from '../../theme';

export default function Theme(props: IThemeProps) {
  const theme: Theme = themeCreator(props.type);

  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}

export interface IThemeOwnProps {
  children: React.ReactNode;
}

export interface IThemeStateProps {
  type: string;
}

export type IThemeProps = IThemeOwnProps & IThemeStateProps;
