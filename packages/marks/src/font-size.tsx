import { contextType, EditorPlugin, Plugin } from '@slate-doc/core';
import { CSSProperties } from 'react';

const FontSizeRender = (context: contextType) => {
  const isHeading = !!context.props.element.heading;
  const size = (context.props.element.fontSize ||
    '') as CSSProperties['fontSize'];
  !isHeading && (context.style.fontSize = size);

  return context.children;
};

const FontSize = new EditorPlugin({
  type: 'font-size',
  elements: {
    render: FontSizeRender,
    props: {
      nodeType: 'block',
    },
  },
  options: {
    create(editor) {},
    match(context) {
      return !!context.props.element['fontSize'];
    },
  },
} as Plugin);

export { FontSize };
