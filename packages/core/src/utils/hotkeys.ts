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
};
