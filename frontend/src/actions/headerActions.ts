export enum HeaderActionTypes {
  OPEN_MENU = 'header/openMenu',
  CLOSE_MENU = 'header/closeMenu'
}

export function openMenu() {
  return {
    type: HeaderActionTypes.OPEN_MENU
  };
}

export function closeMenu() {
  return {
    type: HeaderActionTypes.CLOSE_MENU
  };
}

export interface IOpenMenuAction {
  type: HeaderActionTypes.OPEN_MENU;
}

export interface ICloseMenuAction {
  type: HeaderActionTypes.CLOSE_MENU;
}

export type HeaderAction = IOpenMenuAction & ICloseMenuAction;
