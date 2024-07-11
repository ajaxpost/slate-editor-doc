import { EditorType, generateId } from '@slate-doc/core';
import type { HOTKEYS_TYPE, SlateElement } from '@slate-doc/core';
import { Editor, Element, Path, Transforms } from 'slate';

export function onKeyDown(editor: EditorType, hotkeys: HOTKEYS_TYPE) {
  return (event: React.KeyboardEvent) => {
    const slate = editor.slate;
    if (!slate || !slate.selection) return;
    const match = Editor.above<SlateElement>(slate, {
      at: slate.selection,
      match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
    });
    if (!match) return;
    const [node, path] = match;
    if (!node['heading']) return;
    if (event.isDefaultPrevented()) return;
    const parentPath = Path.parent(slate.selection.anchor.path);
    const isStart = Editor.isStart(slate, slate.selection.anchor, parentPath);
    const isEnd = Editor.isEnd(slate, slate.selection.anchor, parentPath);
    if (hotkeys.isBackspace(event) && isStart) {
      event.preventDefault();
      Transforms.unsetNodes(slate, 'heading');
    }

    if (hotkeys.isEnter(event) && isEnd) {
      event.preventDefault();

      const newNode = JSON.parse(JSON.stringify(node));
      delete newNode['heading'];
      Transforms.insertNodes(
        slate,
        {
          ...newNode,
          id: generateId(),
          children: [{ ...node.children[0], text: '' }],
        },
        {
          select: true,
        }
      );
      if (path.length >= 2) {
        Transforms.unsetNodes(slate, 'id');
      }
    }
  };
}
