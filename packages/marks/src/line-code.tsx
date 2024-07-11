import { EditorPlugin, leafContextType, LeafPlugin } from '@slate-doc/core';
import { Editor, Range } from 'slate';
import { css } from '@emotion/css';

const LineCodeRender = (context: leafContextType) => {
  return (
    <code
      className={css`
        border-radius: 3px;
        padding: 0 2px;
        border: 1px solid #e5e6eb;
        background-color: #f2f3f5;
      `}
    >
      {context.children}
    </code>
  );
};

const LineCode = new EditorPlugin({
  type: 'line-code',
  elements: {
    render: LineCodeRender,
    props: {
      nodeType: 'inline',
    },
  },
  events: {
    onKeyDown(editor, HOTKEYS) {
      return (e: React.KeyboardEvent) => {
        const slate = editor.slate;
        if (!slate || !slate.selection) return;
        const marks = Editor.marks(slate);
        if (!marks || !marks['line-code']) return;
        if (e.isDefaultPrevented()) return;
        if (HOTKEYS.isEnter(e)) {
          e.preventDefault();
          Editor.removeMark(slate, 'line-code');
        }
        if (HOTKEYS.isArrowRight(e) && Range.isCollapsed(slate.selection)) {
          const nextPoint = Editor.after(slate, slate.selection.anchor, {
            unit: 'character',
          });
          if (!nextPoint) {
            e.preventDefault();
            Editor.removeMark(slate, 'line-code');
          }
        }
      };
    },
  },
  options: {
    create(editor) {
      const slate = editor.slate;
      if (!slate || !slate.selection) return;

      const marks = Editor.marks(slate);
      if (marks && marks['line-code']) {
        Editor.removeMark(slate, 'line-code');
      } else {
        Editor.addMark(slate, 'line-code', true);
      }
    },
    match(context) {
      return !!context.props.leaf['line-code'];
    },
    hotkey: ['mod+e'],
  },
} as LeafPlugin);

export { LineCode };
