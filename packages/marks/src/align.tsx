import { contextType, EditorPlugin, Plugin } from '@slate-doc/core';
import { CSSProperties } from 'react';

const AlignRender = (context: contextType) => {
  const align = (context.props.element.align ||
    'left') as CSSProperties['textAlign'];
  context.style.textAlign = align;
  return context.children;
};

const Align = new EditorPlugin({
  type: 'align',
  elements: {
    render: AlignRender,
    props: {
      nodeType: 'block',
    },
  },
  options: {
    shortcuts: [],
    create(editorState) {},
    match(context) {
      return !!context.props.element.align;
    },
  },
} as Plugin);

export { Align };
