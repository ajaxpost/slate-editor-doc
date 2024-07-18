import { EditorType } from '@slate-doc/core';
import type { HOTKEYS_TYPE, SlateElement } from '@slate-doc/core';
import { Editor, Element, Point } from 'slate';

export function onKeyDown(editor: EditorType, hotkeys: HOTKEYS_TYPE) {
  return (event: React.KeyboardEvent) => {
    const slate = editor.slate;
    if (!slate || !slate.selection) return;
    const match = Editor.above<SlateElement>(slate, {
      at: slate.selection,
      match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
    });
    if (!match) return;
    const [, path] = match;
    const parentMatch = Editor.parent(slate, path);
    if (!parentMatch) return;
    const [parentNode, parentPath] = parentMatch;
    if (!parentNode['table-cell']) return;
    if (event.isDefaultPrevented()) return;
    if (hotkeys.isBackspace(event)) {
      const start = Editor.start(slate, parentPath);

      if (Point.equals(slate.selection.anchor, start)) {
        event.preventDefault();
      }
    }
  };
}
