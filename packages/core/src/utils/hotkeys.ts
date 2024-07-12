import isHotkey from 'is-hotkey';

const create = (key: string) => {
  return (event: React.KeyboardEvent) => {
    return isHotkey(key, event);
  };
};

export const HOTKEYS = {
  isEnter: create('enter'),
  isArrowUp: create('up'),
  isArrowDown: create('down'),
  isArrowLeft: create('left'),
  isArrowRight: create('right'),
  isTab: create('tab'),
  isBackspace: create('backspace'),
  isSlash: create('/'),
  isCtrlEnter: create('ctrl+enter'),
};
