import { EditorPlugin, RenderElementProps } from '@slate-doc/core';
import { css } from '@emotion/css';
import { onKeyDown } from '../events/onKeyDown';

const NumberedListRender = (props: RenderElementProps) => {
  const depth = (props.element.props?.depth || 0) as number;
  const order = (props.element.props?.order || 0) as number;
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
        {order + 1}
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

const NumberedList = new EditorPlugin({
  type: 'NumberedList',
  elements: {
    'numbered-list': {
      render: NumberedListRender,
      props: {
        nodeType: 'block',
        type: 'numbered-list',
        depth: 0, // 控制缩进
        order: 0, // 控制序号
      },
    },
  },
  events: {
    onKeyDown,
  },
  options: {
    shortcuts: ['1.'],
  },
});
export { NumberedList };
