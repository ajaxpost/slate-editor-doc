import { EditorPlugin, RenderElementProps } from '@slate-doc/core';
import { css } from '@emotion/css';
import { onKeyDown } from '../events/onKeyDown';

const BulletedListRender = (props: RenderElementProps) => {
  const depth = (props.element.props?.depth || 0) as number;

  return (
    <div
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
      className={css`
        align-items: center;
        display: flex;
        position: relative;

        font-size: 16px;
        line-height: 1.75rem;
        padding-bottom: 2px;
        padding-left: 1rem;
        padding-top: 2px;

        margin-left: ${depth * 20}px;
      `}
    >
      <span
        className={css`
          font-weight: 700;
          left: 0;
          min-width: 10px;
          position: absolute;
          top: 0;
          user-select: none;
          -webkit-user-select: none;
          width: auto;
        `}
      >
        •
      </span>
      <span
        className={css`
          margin-left: 10px;
          flex-grow: 1;
        `}
      >
        {props.children}
      </span>
    </div>
  );
};

const BulletedList = new EditorPlugin({
  type: 'BulletedList',
  elements: {
    'bulleted-list': {
      render: BulletedListRender,
      props: {
        nodeType: 'block',
        type: 'bulleted-list',
        depth: 0,
        order: 0,
      },
    },
  },
  events: {
    onKeyDown,
  },
  options: {
    shortcuts: ['-'],
  },
});
export { BulletedList };
