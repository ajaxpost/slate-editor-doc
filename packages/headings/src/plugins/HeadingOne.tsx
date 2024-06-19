import { EditorPlugin, RenderElementProps } from '@slate-doc/core';

const HeadingOneRender = (props: RenderElementProps) => {
  return (
    <h1
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
    >
      {props.children}
    </h1>
  );
};

const HeaderOne = new EditorPlugin({
  type: 'HeadingOne',
  elements: {
    'heading-one': {
      render: HeadingOneRender,
      props: {
        nodeType: 'block',
      },
    },
  },
  options: {
    shortcuts: ['#', 'h1'],
  },
});

export { HeaderOne };
