import {
  EditorType,
  HOTKEYS_TYPE,
  SlateElement,
  generateId,
} from '@slate-doc/core';
import { Editor, Element, Path, Transforms } from 'slate';

export function onKeyDown(editor: EditorType, hotkeys: HOTKEYS_TYPE) {
  return (event: React.KeyboardEvent) => {
    const slate = editor.slate;
    if (!slate || !slate.selection) return;

    const match = Editor.above<SlateElement>(slate, {
      at: slate.selection,
      match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
      mode: 'highest',
    });
    if (!match) return;
    const [node, path] = match;

    if (node.type === 'blockquote') {
      if (hotkeys.isEnter(event)) {
        event.preventDefault();

        if (!Path.isParent(path, slate.selection.anchor.path)) {
          Editor.withoutNormalizing(slate, () => {
            Transforms.insertNodes(
              slate,
              {
                ...node,
                id: generateId(),
                children: [{ text: '' }],
              },
              {
                at: Path.next(path),
                select: true,
              }
            );
          });
        } else {
          Editor.withoutNormalizing(slate, () => {
            Editor.insertBreak(slate);
          });
        }
      }
    }
  };
}
