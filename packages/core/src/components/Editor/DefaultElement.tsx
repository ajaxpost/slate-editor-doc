import { css } from '@emotion/css';
import { FC } from 'react';
import { RenderElementProps } from 'slate-react';

const DefaultElement: FC<RenderElementProps> = (props) => {
  return (
    <div
      {...props.attributes}
      className={css`
        position: relative;
      `}
    >
      {props.children}
    </div>
  );
};

export default DefaultElement;
