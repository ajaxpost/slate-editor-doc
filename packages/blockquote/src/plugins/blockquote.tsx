import { EditorPlugin, RenderElementProps } from '@slate-doc/core';
import { css } from '@emotion/css';

const BlockQuoteRender = (props: RenderElementProps) => {
  return (
    <blockquote
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
      className={css`
        margin-top: 0.25rem;
        margin-bottom: 0.25rem;
        border-width: 0px;
        border-left-width: 2px;
        border-style: solid;
        border-color: #e5e7eb;
        padding-left: 1.5rem;
        font-style: italic;
        margin: 0;
      `}
    >
      {props.children}
    </blockquote>
  );
};

const BlockQuote = new EditorPlugin({
  type: 'BlockQuote',
  elements: {
    blockquote: {
      render: BlockQuoteRender,
      props: {
        nodeType: 'block',
      },
    },
  },
  options: {
    shortcuts: ['>', 'blockquote'],
  },
});

export { BlockQuote };
