import { EditorPlugin, RenderElementProps } from '@slate-doc/core';

const BlockQuoteRender = (props: RenderElementProps) => {
  return (
    <blockquote
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
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
