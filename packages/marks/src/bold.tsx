import { EditorPlugin, leafContextType, LeafPlugin } from '@slate-doc/core';
import { Editor } from 'slate';

const BoldRender = (context: leafContextType) => {
  return <strong>{context.children}</strong>;
};

const Bold = new EditorPlugin({
  type: 'bold',
  elements: {
    renderLeaf: BoldRender,
    props: {
      nodeType: 'inline',
    },
  },
  options: {
    create(editor) {
      const slate = editor.slate;
      if (!slate || !slate.selection) return;

      const marks = Editor.marks(slate);
      if (marks && marks['bold']) {
        Editor.removeMark(slate, 'bold');
      } else {
        Editor.addMark(slate, 'bold', true);
      }
    },
    matchLeaf(context) {
      return !!context.props.leaf['bold'];
    },
    hotkey: ['mod+b'],
  },
} as LeafPlugin);

export { Bold };
