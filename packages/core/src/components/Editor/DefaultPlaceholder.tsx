import { FC } from 'react';
import { css } from '@emotion/css';
import { RenderElementProps } from 'slate-react';

const DefaultPlaceholder: FC<RenderElementProps> = (props) => {
  return (
    <p
      {...props.attributes}
      data-placeholder={props.element.props?.placeholder}
      className={css`
        margin: 10px 0;
        padding-left: 30px;
        &:before {
          user-select: none;
          content: attr(data-placeholder);
          color: #ccc;
          pointer-events: none;
          position: absolute;
        }
      `}
    >
      {props.children}
    </p>
  );
};

export default DefaultPlaceholder;
