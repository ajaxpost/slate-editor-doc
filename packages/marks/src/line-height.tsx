import { contextType, EditorPlugin, Plugin } from '@slate-doc/core';
import { CSSProperties } from 'react';

const LineHeightRender = (context: contextType) => {
  const lineHeight = context.props.element[
    'line-height'
  ] as CSSProperties['lineHeight'];
  context.style.lineHeight = lineHeight;
  return context.children;
};

const LineHeight = new EditorPlugin({
  type: 'line-height',
  elements: {
    render: LineHeightRender,
    props: {
      nodeType: 'block',
    },
  },
  options: {
    shortcuts: [],
    create(editorState) {},
    match(context) {
      return !!context.props.element['line-height'];
    },
  },
} as Plugin);

export { LineHeight };
