import { EditorPlugin, leafContextType, LeafPlugin } from '@slate-doc/core';

const BoldRender = (context: leafContextType) => {
  const color = context.props.leaf.color;
  const bgColor = context.props.leaf['bg-color'];
  return (
    <span
      style={{
        color,
        backgroundColor: bgColor,
      }}
    >
      {context.children}
    </span>
  );
};

const FontColor = new EditorPlugin({
  type: 'font-color',
  elements: {
    render: BoldRender,
    props: {
      nodeType: 'inline',
    },
  },
  options: {
    create(editor) {},
    match(context) {
      return !!context.props.leaf['color'] || !!context.props.leaf['bg-color'];
    },
  },
} as LeafPlugin);

export { FontColor };
