import React, { createContext } from 'react';

export type ToolbarContextType = {
  textAndTitle?: string;
  fontSize?: {
    size: string;
    disabled: boolean;
  };
};

const DEFAULT_HANDLERS: ToolbarContextType = {};

export const ToolbarContext =
  createContext<ToolbarContextType>(DEFAULT_HANDLERS);

type Props = {
  children: React.ReactNode;
  value: ToolbarContextType;
};

const ToolbarProvider = ({ children, value }: Props) => {
  return (
    <ToolbarContext.Provider value={value}>{children}</ToolbarContext.Provider>
  );
};

const useToolbarState = () => {
  const context = React.useContext(ToolbarContext);
  if (!context) {
    throw new Error('useToolbarState 必须在 ToolbarProvider 内部使用');
  }
  return context;
};

export { ToolbarProvider, useToolbarState };
