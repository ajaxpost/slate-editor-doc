import { EditorPlugin, RenderElementProps } from '@slate-doc/core';

const HeadingThreeRender = (props: RenderElementProps) => {
  return (
    <h3
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
    >
      {props.children}
    </h3>
  );
};

const HeaderThree = new EditorPlugin({
  type: 'HeadingThree',
  elements: {
    'heading-three': {
      render: HeadingThreeRender,
      props: {
        nodeType: 'block',
      },
    },
  },
  options: {
    shortcuts: ['###', 'h3'],
  },
});

export { HeaderThree };
