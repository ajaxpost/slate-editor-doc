import { EditorPlugin, RenderElementProps } from '@slate-doc/core';
import { css } from '@emotion/css';

const HeadingOneRender = (props: RenderElementProps) => {
  return (
    <h1
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
      className={css`
        margin: 0;
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
      `}
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
