import {
  EditorType,
  generateId,
  HOTKEYS_TYPE,
  SlateElement,
} from '@slate-doc/core';
import { Editor, Element, Point, Transforms } from 'slate';

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

    if (event.isDefaultPrevented()) return;
    if (!parentNode['code']) return;
    const start = Editor.start(slate, parentPath);

    if (hotkeys.isBackspace(event)) {
      if (Point.equals(slate.selection.anchor, start)) {
        event.preventDefault();
        Transforms.unwrapNodes(slate, {
          split: true,
          match(n) {
            return (
              Element.isElement(n) && Editor.isBlock(slate, n) && !!n['code']
            );
          },
        });
        Transforms.unsetNodes(slate, 'code-item');
        if (parentPath.length < 2) {
          Transforms.setNodes(slate, {
            id: generateId(),
          });
        }
      }
    }
  };
}
