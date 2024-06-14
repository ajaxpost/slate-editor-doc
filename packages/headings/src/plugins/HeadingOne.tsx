import { EditorPlugin, RenderSlateElementProps } from '@slate-doc/core';

const HeadingOneRender = (props: RenderSlateElementProps) => {
  console.log(props, 'h1');

  return <></>;
};

const HeaderOne = new EditorPlugin({
  type: 'HeadingOne',
  elements: {
    'heading-one': {
      render: HeadingOneRender,
      props: {},
    },
  },
  options: {
    shortcuts: ['#'],
  },
});

export { HeaderOne };
