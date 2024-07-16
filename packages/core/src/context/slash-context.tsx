import React from 'react';
import { createContext } from 'react';
import { menuConfig } from '../components/ActionMenu/config';

export type SlashContextType = {
  menuPosition: {
    top: number;
    left: number;
  };
  setMenuPosition: React.Dispatch<
    React.SetStateAction<{
      top: number;
      left: number;
    }>
  >;
  menuShow: boolean;
  setMenuShow: React.Dispatch<React.SetStateAction<boolean>>;
  menuActiveKey: string;
  setMenuActiveKey: React.Dispatch<React.SetStateAction<string>>;
  actions: typeof menuConfig;
  setActions: React.Dispatch<React.SetStateAction<typeof menuConfig>>;
};

const DEFAULT_HANDLERS: SlashContextType = {
  menuPosition: {
    top: 0,
    left: 0,
  },
  setMenuPosition: () => {},
  menuShow: false,
  setMenuShow: () => {},
  menuActiveKey: '',
  setMenuActiveKey: () => {},
  actions: [],
  setActions: () => {},
};

export const SlashContext = createContext<SlashContextType>(DEFAULT_HANDLERS);

type Props = {
  children: React.ReactNode;
  value: SlashContextType;
};

const SlashProvider = ({ children, value }: Props) => {
  return (
    <SlashContext.Provider value={value}>{children}</SlashContext.Provider>
  );
};

const useSlashState = () => {
  const context = React.useContext(SlashContext);
  if (!context) {
    throw new Error('useSlashState 必须在 SlashProvider 内部使用');
  }
  return context;
};

export { SlashProvider, useSlashState };
