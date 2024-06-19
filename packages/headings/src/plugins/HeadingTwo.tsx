import { EditorPlugin, RenderElementProps } from '@slate-doc/core';

const HeadingTwoRender = (props: RenderElementProps) => {
  return (
    <h2
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
    >
      {props.children}
    </h2>
  );
};

const HeaderTwo = new EditorPlugin({
  type: 'HeadingTwo',
  elements: {
    'heading-two': {
      render: HeadingTwoRender,
      props: {
        nodeType: 'block',
      },
    },
  },
  options: {
    shortcuts: ['##', 'h2'],
  },
});

export { HeaderTwo };
