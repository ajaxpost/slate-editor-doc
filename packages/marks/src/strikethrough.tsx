import { EditorPlugin, leafContextType, LeafPlugin } from '@slate-doc/core';
import { Editor } from 'slate';

const StrikethroughRender = (context: leafContextType) => {
  return <s>{context.children}</s>;
};

const Strikethrough = new EditorPlugin({
  type: 'strikethrough',
  elements: {
    renderLeaf: StrikethroughRender,
    props: {
      nodeType: 'inline',
    },
  },
  options: {
    create(editor) {
      const slate = editor.slate;
      if (!slate || !slate.selection) return;

      const marks = Editor.marks(slate);
      if (marks && marks['strikethrough']) {
        Editor.removeMark(slate, 'strikethrough');
      } else {
        Editor.addMark(slate, 'strikethrough', true);
      }
    },
    matchLeaf(context) {
      return !!context.props.leaf['strikethrough'];
    },
    hotkey: ['mod+x'],
  },
} as LeafPlugin);

export { Strikethrough };
