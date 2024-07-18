import { createContext, useContext, Dispatch, SetStateAction } from 'react';

export type TableContextType = {
  widths: number[];
  setWidths: Dispatch<SetStateAction<number[]>>;
};

const DEFAULT_HANDLERS: TableContextType = {
  widths: [],
  setWidths: () => {},
};

export const TableContext = createContext<TableContextType>(DEFAULT_HANDLERS);

type Props = {
  children: React.ReactNode;
  value: TableContextType;
};

const TableProvider = ({ children, value }: Props) => {
  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
};

const useTableState = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableState 必须在 TableProvider 内部使用');
  }
  return context;
};

export { TableProvider, useTableState };
