import { EditorPlugin, leafContextType, LeafPlugin } from '@slate-doc/core';
import { Editor } from 'slate';

const ItalicRender = (context: leafContextType) => {
  return <i>{context.children}</i>;
};

const Italic = new EditorPlugin({
  type: 'italic',
  elements: {
    renderLeaf: ItalicRender,
    props: {
      nodeType: 'inline',
    },
  },
  options: {
    create(editor) {
      const slate = editor.slate;
      if (!slate || !slate.selection) return;

      const marks = Editor.marks(slate);
      if (marks && marks['italic']) {
        Editor.removeMark(slate, 'italic');
      } else {
        Editor.addMark(slate, 'italic', true);
      }
    },
    matchLeaf(context) {
      return !!context.props.leaf['italic'];
    },
    hotkey: ['mod+i'],
  },
} as LeafPlugin);

export { Italic };
