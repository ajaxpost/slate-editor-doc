import { FC, ReactNode } from 'react';
import { css } from '@emotion/css';
import { RenderLeafProps, useSelected } from 'slate-react';

interface IProps {
  attributes: RenderLeafProps['attributes'];
  children: ReactNode;
  placeholder: string | undefined;
}

const TextLeaf: FC<IProps> = ({ attributes, children, placeholder }) => {
  const selected = useSelected();

  return (
    <span
      {...attributes}
      className={css`
        &:after {
          color: inherit;
          content: attr(data-placeholder);
          font-size: 75%;
          font-style: inherit;
          font-weight: inherit;
          opacity: 0.5;
          padding-left: 5px;
          position: absolute;
          text-indent: 2px;
          top: 50%;
          transform: translateY(-50%);
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
        }
      `}
      data-placeholder={selected && placeholder ? placeholder : undefined}
    >
      {children}
    </span>
  );
};

export default TextLeaf;
