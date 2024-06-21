import { EditorPlugin, RenderElementProps } from '@slate-doc/core';
import { css } from '@emotion/css';

const HeadingTwoRender = (props: RenderElementProps) => {
  return (
    <h2
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
      className={css`
        margin: 0;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
      `}
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
