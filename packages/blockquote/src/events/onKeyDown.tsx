import {
  EditorType,
  HOTKEYS_TYPE,
  SlateElement,
  buildBlockElement,
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
    });
    if (!match) return;
    const [currentNode, currentNodePath] = match;
    const parentEntry = Editor.parent(slate, currentNodePath);
    const [parentNodeElement, parentPath] = parentEntry;
    if (!Element.isElement(parentNodeElement)) return;

    if (parentNodeElement.type === 'blockquote') {
      if (hotkeys.isEnter(event)) {
        event.preventDefault();

        Editor.withoutNormalizing(slate, () => {
          Transforms.insertNodes(
            slate,
            {
              ...parentNodeElement,
              id: generateId(),
              children: [
                {
                  ...currentNode,
                  id: generateId(),
                  children: [{ text: '' }],
                },
              ],
            },
            {
              at: Path.next(parentPath),
              select: true,
            }
          );
          if (currentNode.type.includes('heading'))
            Transforms.setNodes(slate, {
              type: 'paragraph',
            });
        });
      }
      if (hotkeys.isBackspace(event)) {
        const text = Editor.string(slate, currentNodePath);
        if (text.trim().length === 0) {
          event.preventDefault();
          if (currentNode.type !== 'paragraph') {
            Transforms.setNodes(slate, {
              type: 'paragraph',
            });
          } else {
            Transforms.removeNodes(slate, {
              at: parentPath,
            });
            const elementNode = buildBlockElement({
              type: 'paragraph',
              props: {},
            });
            Transforms.insertNodes(slate, elementNode, {
              at: parentPath,
              select: true,
            });
          }
        }
      }
    }
  };
}
