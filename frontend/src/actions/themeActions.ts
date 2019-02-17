export enum ThemeActionTypes {
  TOGGLE_THEME = 'theme/toggleTheme'
}

export function toggleTheme(): IToggleThemeAction {
  return {
    type: ThemeActionTypes.TOGGLE_THEME
  };
}

export interface IToggleThemeAction {
  type: ThemeActionTypes.TOGGLE_THEME;
}

export type CounterAction = IToggleThemeAction;
