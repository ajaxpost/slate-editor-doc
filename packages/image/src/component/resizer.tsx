import { FC } from 'react';
import { css } from '@emotion/css';

const Resizer: FC = () => {
  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      `}
      contentEditable={false}
    >
      <div
        className={css`
          width: 6px;
          height: 48px;
          border-radius: 20px;
          border-width: 1px;
          border-style: solid;
          border-color: hsla(0, 0%, 100%, 0.9);
          background-color: hsla(0, 0%, 6%, 0.6);
        `}
      ></div>
    </div>
  );
};

export default Resizer;
