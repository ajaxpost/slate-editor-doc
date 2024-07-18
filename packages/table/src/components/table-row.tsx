import { FC, ReactNode } from 'react';
import { css } from '@emotion/css';

interface IProps {
  children: ReactNode;
}

const TableRow: FC<IProps> = ({ children }) => {
  return (
    <tr
      className={css`
        border-width: 0;
        height: 42.2px;
      `}
    >
      {children}
    </tr>
  );
};

export default TableRow;
