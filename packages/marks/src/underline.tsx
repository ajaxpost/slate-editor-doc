import { EditorPlugin, leafContextType, LeafPlugin } from '@slate-doc/core';
import { Editor } from 'slate';

const UnderlineRender = (context: leafContextType) => {
  return <u>{context.children}</u>;
};

const Underline = new EditorPlugin({
  type: 'underline',
  elements: {
    render: UnderlineRender,
    props: {
      nodeType: 'inline',
    },
  },
  options: {
    create(editor) {
      const slate = editor.slate;
      if (!slate || !slate.selection) return;

      const marks = Editor.marks(slate);
      if (marks && marks['underline']) {
        Editor.removeMark(slate, 'underline');
      } else {
        Editor.addMark(slate, 'underline', true);
      }
    },
    match(context) {
      return !!context.props.leaf['underline'];
    },
    hotkey: ['mod+u'],
  },
} as LeafPlugin);

export { Underline };
