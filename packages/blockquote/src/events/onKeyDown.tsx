import { EditorType, HOTKEYS_TYPE } from '@slate-doc/core';
import { Editor } from 'slate';

export function onKeyDown(editor: EditorType, hotkeys: HOTKEYS_TYPE) {
  return (event: React.KeyboardEvent) => {
    const slate = editor.slate;
    if (!slate || !slate.selection) return;

    // @ts-ignore
    const [node] = Editor.above(slate, {
      at: slate.selection,
    });
    if (node.type === 'blockquote') {
      console.log('blockquote onKeyDown node: ', node);
    }
  };
}
