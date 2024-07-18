import { FC, ReactNode, useState } from 'react';
import { css } from '@emotion/css';
import { TableProvider } from '../context/table-context';

interface IProps {
  children: ReactNode;
  colsWidth: number[];
}

const Table: FC<IProps> = ({ children, colsWidth }) => {
  const [widths, setWidths] = useState<number[]>(colsWidth);
  return (
    <div
      className={css`
        cursor: default;
        max-width: 100%;
        overflow-x: scroll;
        padding-bottom: 3px;
        padding-top: 15px;
        position: relative;
        width: 100%;
      `}
    >
      <table
        cellSpacing={0}
        cellPadding={0}
        className={css`
          border-collapse: collapse;
          border-spacing: 0;
          cursor: auto;
          table-layout: fixed;
          width: 100%;
        `}
      >
        <colgroup contentEditable={false}>
          {widths.map((width, key) => {
            return (
              <col
                key={key}
                style={{
                  width,
                }}
              />
            );
          })}
          <col
            style={{
              width: '100%',
            }}
          />
        </colgroup>
        <TableProvider
          value={{
            widths,
            setWidths,
          }}
        >
          <tbody>{children}</tbody>
        </TableProvider>
      </table>
    </div>
  );
};

export default Table;
